import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { Prisma, Senior } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import { deleteProfilePicture, filesToFormData, uploadProfilePicture } from "../utils/files"
import { AppError, constants, getServerTokens, httpRequest, ServerTokens } from "@repo/lib"

/// Controlador para manejar el registro de adultos mayores desde la aplicación móvil
export const registerFromMobile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Verificar si el adulto mayor ya existe en la base de datos
		const { rut, pin, email } = req.body

		if (await prisma.senior.findUnique({ where: { id: rut } })) {
			throw new AppError(409, "La persona que estas tratando de registrar ya existe")
		}

		// Si el adulto mayor no existe, se crea un registro en la base de datos

		await prisma.senior.create({
			data: {
				id: rut,
				name: "",
				email: email,
				password: await hash(pin, 10),
				address: "",
				birthDate: new Date(),
			},
		})

		// Se envían los archivos a la API de almacenamiento (storage)

		if (!req.files || Object.keys(req.files).length === 0) {
			throw new AppError(400, "No se han enviado archivos")
		}

		console.log(req.files)

		const formData = filesToFormData(req.files as { [fieldname: string]: Express.Multer.File[] })

		console.log(formData)

		// Para ello se deben convertir los buffers de la librería MULTER a blobs
		// compatibles con la API de FETCH

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/upload?path=%2Fseniors%2F${rut}`,
			method: "POST",
			variant: "MULTIPART",
			body: formData,
		})

		if (response.type == "error") {
			await prisma.senior.delete({ where: { id: rut } })
			throw new AppError(response.status ?? 500, response.message)
		}

		return res.status(201).json({
			message: "La persona mayor se ha registrado correctamente",
			type: "success",
			values: null,
		})
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
			return res.status(200).json({ message: "La solicitud ha sido aceptada", type: "success" })
		} else {
			// Si la solicitud es rechazada, se eliminan los archivos enviados
			// y se elimina el adulto mayor de la base de datos

			// La extensión "tokens" es un objeto de tipo ServerTokens
			// que contiene los tokens de acceso y/o refresco del usuario que realiza la petición http

			const tokens = req.getExtension("tokens") as ServerTokens

			const storageResponse = await httpRequest({
				service: "STORAGE",
				endpoint: `/delete?path=%2Fseniors%2F${id}`,
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${tokens?.access || null}`,
				},
			})

			if (storageResponse.type === "error") {
				throw new AppError(storageResponse.status || 500, storageResponse.message)
			}

			await prisma.senior.delete({ where: { id } })

			return res.status(200).json({
				message: "La solicitud ha sido denegada",
				type: "success",
				values: null,
			})
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

// Añadir una persona mayor desde la aplicación web por parte de un administrador

export const create = async (req: Request, res: Response, next: NextFunction) => {
	const { DEFAULT_SENIOR_PASSWORD } = constants

	try {
		const { id, name, email, address, birthDate } = req.body
		const defaulAdminPassword = await hash(DEFAULT_SENIOR_PASSWORD, 10)

		const filter: Prisma.SeniorWhereInput = {
			OR: [{ id }, { email }],
		}

		// Verificar si la persona mayor ya existe en la base de datos

		const userExists = await prisma.senior.findFirst({ where: filter })

		if (userExists) {
			const conflicts = []

			if (userExists?.id === id) conflicts.push("id")
			if (userExists?.email === email) conflicts.push("email")

			throw new AppError(409, "La persona mayor ya existe", { conflicts })
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

		return res.status(201).json({
			message: "Creación exitosa",
			type: "success",
			values: senior,
		})
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

		const response = { updated: senior, image: null }

		if (req.file) {
			// Remover depues de integrar middleware de pertenenencia

			const tokens = getServerTokens(req.headers, req.cookies)

			const authResponse = await httpRequest({
				service: "AUTH",
				endpoint: "/validate-auth",
				method: "GET",
				headers: {
					Authorization: `Bearer ${tokens?.access || null}`,
				},
			})

			if (authResponse.type === "error") {
				throw new AppError(authResponse.status || 500, authResponse.message)
			}

			// --------------------

			const storageResponse = await uploadProfilePicture({
				file: req.file,
				filename: req.params.id,
				endpoint: `/upload?path=%2Fseniors%2F${req.params.id}`,
			})

			if (storageResponse.type === "error") {
				throw new AppError(storageResponse.status || 500, storageResponse.message)
			}

			response.image = storageResponse.values.image
		}

		return res.status(200).json({
			message: "Actualización exitosa",
			type: "success",
			values: response,
		})
	} catch (error) {
		next(error)
	}
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await prisma.event.updateMany({
			where: { seniorId: req.params.id },
			data: { seniorId: null },
		})

		const senior = await prisma.senior.delete({
			where: { id: req.params.id },
		})

		const storageResponse = await deleteProfilePicture(`/delete?path=%2Fseniors%2F${req.params.id}`)

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
			where: { validated: false },
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

// TODO: MANEJO DE ERRORES
export const checkUnique = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { rut, email } = req.body
		if (!rut && !email) {
			return res.status(400).json({
				error: "Debe ingresar un valor en el campo.",
			})
		}
		const field = rut ? rut : email
		const senior = await prisma.senior.findFirst({
			where: {
				OR: [{ id: field }, { email: field }],
			},
		})
		if (senior) {
			return res.status(409).json({
				values: {
					rut: "Este rut ya está registrado, si se trata de un error por favor contacte a soporte.",
					email: "Esta dirección de correo ya está registrado, por favor ingrese otro.",
				},
			})
		}
		return res.status(200).send()
	} catch (error) {
		next(error)
	}
}
