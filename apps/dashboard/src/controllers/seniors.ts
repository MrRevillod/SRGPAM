import { Request, Response, NextFunction } from "express"
import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { AppError, httpRequest } from "@repo/lib"

export const registerSeniorFromMobile = async (req: Request, res: Response, next: NextFunction) => {
	const { rut, pin, email } = req.body
	const files = req.files as {
		[fieldname: string]: Express.Multer.File[]
	}
	try {
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
				password: hashedPin,
				email: email !== undefined ? email : "",
				address: "",
				birthDate: new Date(),
				name: "",
			},
		})
		const formData = new FormData()
		formData.append("dni-a", files["dni-a"][0].buffer, files["dni-a"][0].originalname)
		formData.append("dni-b", files["dni-b"][0].buffer, files["dni-b"][0].originalname)
		formData.append("social", files["social"][0].buffer, files["social"][0].originalname)
		const response = await httpRequest<null>("STORAGE", `/seniors/${rut}`, "POST", "MULTIPART", formData)
		if (response.type == "error") {
			throw new AppError(response.status ?? 500, response.message)
		}
		return res.status(200).json({ message: "El adulto mayor se a registrado correctamente", type: "success", values: null })
	} catch (error: unknown) {
		next(error)
	}
}
