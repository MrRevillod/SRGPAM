import { JsonResponse } from "@repo/lib"
import { NextFunction, Request, RequestHandler, Response } from "express"
import { upload } from "./multer"
import { rmSync, existsSync, readdirSync, Dir } from "fs"

// export const singleController = (req: Request, res: Response, next: NextFunction) => {
// 	upload.single("file")(req, res, (err) => {})

// 	const response: JsonResponse = {
// 		message: "Upload sucess",
// 		type: "success",
// 		values: null,
// 	}

// 	return res.status(200).json(response)
// }

export const arrayController: RequestHandler = (req, res, next) => {
	upload.fields([
		{ name: "profile", maxCount: 1 },
		{ name: "dni0", maxCount: 1 },
		{ name: "dni1", maxCount: 1 },
		{ name: "RSH", maxCount: 1 },
	])(req, res, (err) => {})

	const response: JsonResponse = {
		message: "Upload sucess",
		type: "success",
		values: null,
	}

	return res.status(200).json(response)
}

// export const getController: RequestHandler = (req, res, next) => {
// 	const response: JsonResponse = {
// 		message: "sucess",
// 		type: "success",
// 		values: { files: "" },
// 	}

// 	return res.status(200).json(response)
// }

export const deleteController: RequestHandler = (req, res, next) => {
	const dir = `public/${req.params["id"]}`

	const fileNames = ["dni0", "dni1", "RSH"]

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

	const response: JsonResponse = {
		message: "sucess",
		type: "success",
		values: null,
	}

	return res.status(200).json(response)
}
