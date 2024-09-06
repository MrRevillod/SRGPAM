import { hash } from "bcrypt"
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
		await prisma.senior.delete({ where: { id: rut } })

		if (
			!files["dni-a"] ||
			files["dni-a"][0] === undefined ||
			!files["dni-b"] ||
			files["dni-b"][0] === undefined ||
			!files["social"] ||
			files["social"][0] === undefined
		) {
			throw new AppError(400, "No se enviaron los archivos requeridos")
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

export const handleSeniorRequest = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params
	const validated = req.query.validate === "true"

	try {
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
