import { hash, compare } from "bcrypt"
import { prisma } from "@repo/database"
import { bufferToBlob } from "../utils/files"
import { AppError, httpRequest } from "@repo/lib"
import { Request, Response, NextFunction } from "express"

export const registerSeniorFromMobile = async (req: Request, res: Response, next: NextFunction) => {
	const { rut, pin, email } = req.body
	const files = req.files as {
		[fieldname: string]: Express.Multer.File[]
	}

	try {
		const userExists = await prisma.senior.findUnique({ where: { id: rut } })
		if (userExists) {
			throw new AppError(409, "La persona que estas tratando de registrar ya existe")
		}

		const hashedPin = await hash(pin, 10)

		await prisma.senior.create({
			data: {
				id: rut,
				name: "",
				email: email ?? null,
				password: hashedPin,
				address: "",
				birthDate: new Date(),
			},
		})

		const formData = new FormData()

		const dniA = bufferToBlob(files["dni-a"][0].buffer, files["dni-a"][0].mimetype)
		const dniB = bufferToBlob(files["dni-b"][0].buffer, files["dni-b"][0].mimetype)
		const social = bufferToBlob(files["social"][0].buffer, files["social"][0].mimetype)

		formData.append("dni-a", dniA, files["dni-a"][0].originalname)
		formData.append("dni-b", dniB, files["dni-b"][0].originalname)
		formData.append("social", social, files["social"][0].originalname)

		const response = await httpRequest<null>("STORAGE", `/seniors/${rut}`, "POST", "MULTIPART", formData)

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
	const { rut } = req.body
	const file = req.file as Express.Multer.File

	try {
		const userExists = await prisma.senior.findUnique({ where: { id: rut } })
		if (!userExists) {
			throw new AppError(409, "La persona no existe")
		}

		const formData = new FormData()

		const profile = bufferToBlob(file.buffer, file.mimetype)
		formData.append("profile", profile, file.originalname)

		const response = await httpRequest<null>("STORAGE", `/seniors/profile/${rut}`, "POST", "MULTIPART", formData)

		if (response.type == "error") {
			throw new AppError(response.status ?? 500, response.message)
		}

		return res.status(200).json({ message: "La imagen de perfil se a registrado correctamente", type: "success", values: null })
	} catch (error: unknown) {
		next(error)
	}
}

export const handleSeniorRequest = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params
	const validated = req.query.validate === "true"

	try {
		const user = await prisma.senior.findUnique({ where: { id } })

		if (!user) {
			throw new AppError(404, "Adulto mayor no encontrado")
		}

		if (validated) {
			await prisma.senior.update({ where: { id }, data: { validated } })
		} else {
			await prisma.senior.delete({ where: { id } })
		}

		return res.status(200).json({ message: "Adulto mayor con ID ", type: "success" })
	} catch (error: unknown) {
		next(error)
	}
}

export const getAllSeniors = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const senior = await prisma.senior.findMany()
		return res.status(200).json({
			message: "Seniors obtenidos correctamente",
			type: "success",
			values: senior,
		})
	} catch (error) {
		next(error)
	}
}

export const getSeniorById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		return res.status(200).json({
			message: "Información obtenida correctamente",
			type: "success",
			values: req.getExtension("user"),
		})
	} catch (error) {
		next(error)
	}
}

export const createSenior = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, name, email, address, birthDate } = req.body
		const defaulAdminPassword = await hash("1234", 10)

		// TODO! Validar si el usuario ya existe antes de crearlo

		const senior = await prisma.senior.create({
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
		return res.status(200).json({
			message: "Senior created correctamente",
			type: "success",
			values: senior,
		})
	} catch (error) {
		next(error)
	}
}

export const updateSeniorById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password, address, birthDate } = req.body
		const updatePassword = await hash(password, 10)

		const senior = await prisma.senior.update({
			where: { id: req.params.id },
			data: {
				name,
				email,
				password: updatePassword,
				address,
				birthDate: new Date(birthDate),
			},
		})
		return res.status(200).json({
			message: "Senior update correctamente",
			type: "success",
			values: senior,
		})
	} catch (error) {
		next(error)
	}
}

export const deleteSeniorById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const senior = await prisma.senior.delete({
			where: { id: req.params.id },
		})
		return res.status(200).json({
			message: "Senior deleted correctamente",
			type: "success",
			values: senior,
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
