import { AppError } from "@repo/lib"
import { fileWhitelist } from "../config"
import { NextFunction, Request, Response } from "express"
import { validateBufferMIMEType } from "validate-image-type"

export const filesValidation = async (req: Request, res: Response, next: NextFunction) => {
	const files = req.files as {
		[fieldname: string]: Express.Multer.File[]
	}

	try {
		const filenames = ["dni-a", "dni-b", "social"]
		filenames.forEach(async (filename) => {
			if (!files[filename] || files[filename][0] === undefined) {
				throw new AppError(400, "No se enviaron los archivos requeridos")
			}
			const isValidate = await validateBufferMIMEType(files[filename][0].buffer, {
				allowMimeTypes: fileWhitelist,
			})

			if (!isValidate.ok) {
				res.status(400).json({
					message: "Error de formato",
				})
			}
		})
		next()
	} catch (error) {
		next(error)
	}
}

export const fileValidation = async (req: Request, res: Response, next: NextFunction) => {
	const file = req.file as Express.Multer.File

	try {
		if (!file || file === undefined) {
			throw new AppError(400, "No se enviaron los archivos requeridos")
		}
		const isValidate = await validateBufferMIMEType(file.buffer, {
			allowMimeTypes: fileWhitelist,
		})

		if (!isValidate.ok) {
			res.status(400).json({
				message: "Error de formato",
			})
		}
		next()
	} catch (error) {
		next(error)
	}
}
