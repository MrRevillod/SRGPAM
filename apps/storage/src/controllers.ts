import { RequestHandler } from "express"
import { rmSync, existsSync, readdirSync } from "fs"

export const arrayController: RequestHandler = (req, res, next) => {
	const response = {
		message: "Upload sucess",
		type: "success",
		values: null,
	}

	return res.status(200).json(response)
}

export const deleteController: RequestHandler = (req, res, next) => {
	const dir = `public/${req.params["id"]}`

	const fileNames = ["rut-a", "rut-b", "social"]

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

	const response = {
		message: "sucess",
		type: "success",
		values: null,
	}

	return res.status(200).json(response)
}
