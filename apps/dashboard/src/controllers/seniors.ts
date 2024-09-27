import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { bufferToBlob } from "../utils/files"
import { Prisma, Senior } from "@prisma/client"
import { AppError, findUser, httpRequest } from "@repo/lib"
import { Request, Response, NextFunction } from "express"

/// Controlador para manejar el registro de adultos mayores desde la aplicación móvil
export const registerFromMobile = async (req: Request, res: Response, next: NextFunction) => {
	const { rut, pin, email } = req.body
	const files = req.files as {
		[fieldname: string]: Express.Multer.File[]
	}

	try {
		const userExists = await prisma.senior.findUnique({ where: { id: rut } })
		if (userExists) {
			throw new AppError(409, "La persona que estas tratando de registrar ya existe")
		}

		// Si el adulto mayor no existe, se crea

		await prisma.senior.create({
			data: {
				id: rut,
				name: "",
				email: email ?? null,
				password: await hash(pin, 10),
				address: "",
				birthDate: new Date(),
			},
		})

		// Se envían los archivos a la API de almacenamiento (storage)
		// Para ello se deben convertir los buffers de la librería MULTER a blobs
		// compatibles con la API de FETCH

		const formData = new FormData()

		const dniA = bufferToBlob(files["dni-a"][0].buffer, files["dni-a"][0].mimetype)
		const dniB = bufferToBlob(files["dni-b"][0].buffer, files["dni-b"][0].mimetype)
		const social = bufferToBlob(files["social"][0].buffer, files["social"][0].mimetype)

		formData.append("dni-a", dniA, files["dni-a"][0].originalname)
		formData.append("dni-b", dniB, files["dni-b"][0].originalname)
		formData.append("social", social, files["social"][0].originalname)

		// Se envían los archivos a la API de almacenamiento (storage)

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/seniors/${rut}`,
			method: "POST",
			variant: "MULTIPART",
			body: formData,
		})

		if (response.type == "error") {
			await prisma.senior.delete({ where: { id: rut } })
			throw new AppError(response.status ?? 500, response.message)
		}

		return res.status(200).json({ message: "El adulto mayor se a registrado correctamente", type: "success", values: null })
	} catch (error: unknown) {
		next(error)
	}
}

export const uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userExists = await prisma.senior.findUnique({ where: { id: req.body.rut } })
		if (!userExists) {
			throw new AppError(404, "La persona no existe")
		}

		const formData = new FormData()

		const file = req.file as Express.Multer.File
		const profile = bufferToBlob(file.buffer, file.mimetype)
		formData.append("profile", profile, file.originalname)

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/seniors/profile/${req.body.rut}`,
			method: "POST",
			variant: "MULTIPART",
			body: formData,
		})

		if (response.type == "error") {
			throw new AppError(response.status ?? 500, response.message)
		}

		return res.status(200).json({ message: "La imagen de perfil se a registrado correctamente", type: "success", values: null })
	} catch (error: unknown) {
		next(error)
	}
}

// Controlador para manejar las solicitudes de registro de adultos mayores
// Se puede aceptar o rechazar una solicitud de registro
// Esto de pende de la query validate=true | false

export const handleSeniorRequest = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	const validated = req.query.validate === "true"

	try {
		// Se verifica si el adulto mayor existe
		if (!(await prisma.senior.findUnique({ where: { id } }))) {
			throw new AppError(400, "Adulto mayor no encontrado")
		}

		// Si la solicitud es aceptada, se actualiza el campo validated a true
		// Esto significa que el adulto mayor ya puede acceder a la aplicación

		if (validated) {
			await prisma.senior.update({ where: { id }, data: { validated } })
			return res.status(200).json({ message: "La solicitud ha sido aceptada", type: "success", values: null })
		} else {
			// Si la solicitud es rechazada, se eliminan los archivos enviados
			// y se elimina el adulto mayor de la base de datos

			const storageResponse = await httpRequest({
				service: "STORAGE",
				endpoint: `/seniors/${id}`,
				method: "DELETE",
			})

			if (storageResponse.type === "error") {
				throw new AppError(storageResponse.status || 500, storageResponse.message)
			}

			await prisma.senior.delete({ where: { id } })
			return res.status(200).json({ message: "La solicitud ha sido denegada", type: "success", values: null })
		}
	} catch (error: unknown) {
		next(error)
	}
}

// Controladores CRUD para los adultos mayores

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const seniors = await prisma.senior.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				address: true,
				birthDate: true,
				validated: true,
				password: false,
				createdAt: true,
				updatedAt: true,
			},
		})
		return res.status(200).json({
			message: "Seniors obtenidos correctamente",
			type: "success",
			values: {
				seniors,
				len: seniors.length,
			},
		})
	} catch (error) {
		next(error)
	}
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, name, email, address, birthDate } = req.body
		const defaulAdminPassword = await hash("1234", 10)

		const filter: Prisma.SeniorWhereInput = {
			OR: [{ id }, { email }],
		}

		const userExists = await prisma.senior.findFirst({ where: filter })

		if (userExists) {
			const conflicts = []

			if (userExists?.id === id) conflicts.push("id")
			if (userExists?.email === email) conflicts.push("email")

			return res.status(409).json({
				message: "El adulto mayor ya existe",
				type: "error",
				values: { conflicts },
			})
		}

		const { password, ...senior } = await prisma.senior.create({
			data: {
				id,
				name,
				email,
				password: defaulAdminPassword,
				address,
				birthDate: new Date(birthDate),
				validated: true,
			},
		})

		return res.status(200).json({ message: "Creación exitosa", type: "success", values: { senior } })
	} catch (error) {
		next(error)
	}
}

export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	const reqUser = req.getExtension("user") as Senior
	try {
		const { name, email, password, address, birthDate } = req.body

		const senior = await prisma.senior.update({
			where: { id: req.params.id },
			data: {
				name,
				email,
				password: password ? await hash(password, 10) : reqUser.password,
				address,
				birthDate: new Date(birthDate),
			},
			select: {
				id: true,
				name: true,
				email: true,
				address: true,
				birthDate: true,
				validated: true,
				password: false,
				createdAt: true,
				updatedAt: true,
			},
		})

		return res.status(200).json({
			message: "Actualización exitosa",
			type: "success",
			values: { senior },
		})
	} catch (error) {
		next(error)
	}
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const senior = await prisma.senior.delete({
			where: { id: req.params.id },
		})

		const storageResponse = await httpRequest({
			service: "STORAGE",
			endpoint: `/seniors/${req.params.id}`,
			method: "DELETE",
		})

		if (storageResponse.type === "error") {
			await prisma.senior.create({ data: senior })
			throw new AppError(storageResponse.status || 500, storageResponse.message)
		}

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: { deletedId: req.params.id },
		})
	} catch (error) {
		next(error)
	}
}

export const newSeniors = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const seniors = await prisma.senior.findMany({
			where: {
				validated: false,
			},
		})

		return res.status(200).json({
			message: "Seniors encontrados correctamente",
			type: "success",
			values: { seniors, len: seniors.length },
		})
	} catch (error) {
		next(error)
	}
}
