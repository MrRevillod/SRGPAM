import { AppError } from "@repo/lib"
import { RequestHandler } from "express"
import { rmSync, existsSync, readdirSync, mkdirSync, writeFileSync } from "node:fs"

export const arrayController: RequestHandler = (req, res, next) => {
	console.log("files from storage", req.files)

	try {
		const files = req.files as {
			[fieldname: string]: Express.Multer.File[]
		}

		const directory = `public/${req.params["id"]}`

		if (existsSync(directory)) {
			throw new AppError(409, "El directorio de archivos ya existe")
		}

		mkdirSync(directory)

		Object.keys(files).forEach((key) => {
			const extension = files[key][0].originalname.split(".")[1]
			const fileName = `${files[key][0].fieldname}.${extension}`
			writeFileSync(`${directory}/${fileName}`, files[key][0].buffer)
		})

		const response = { message: "Upload success", type: "success", values: null }

		return res.status(200).json(response)
	} catch (error) {
		console.error("Error in arrayController", error)
		next(error)
	}
}

export const deleteController: RequestHandler = (req, res, next) => {
	const dir = `public/${req.params["id"]}`
	const fileNames = ["dni-a", "dni-b", "social"]

	if (existsSync(dir)) {
		const dirFiles = readdirSync(dir)

		dirFiles.forEach((file) => {
			const filename = file.split(".")[0]
			if (fileNames.includes(filename)) {
				const route = `${dir}/${file}`
				rmSync(route)
			}
		})
	}

	const response = { message: "sucess", type: "success", values: null }
	return res.status(200).json(response)
}
