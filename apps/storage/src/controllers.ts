import { JsonResponse } from "@repo/lib"
import { RequestHandler } from "express"
import { upload } from "./multer"

export const singleController: RequestHandler = (req, res, next) => {
	upload.single("file")

	const response: JsonResponse = {
		message: "Upload sucess",
		type: "success",
		values: null,
	}

	return res.status(200).json(response)
}

export const arrayController: RequestHandler = (req, res, next) => {
	upload.array("files")

	const response: JsonResponse = {
		message: "Upload sucess",
		type: "success",
		values: null,
	}

	return res.status(200).json(response)
}

export const getController: RequestHandler = (req, res, next) => {
	const response: JsonResponse = {
		message: "sucess",
		type: "success",
		values: { files: "" },
	}

	return res.status(200).json(response)
}

export const deleteController: RequestHandler = (req, res, next) => {
	const response: JsonResponse = {
		message: "sucess",
		type: "success",
		values: null,
	}

	return res.status(200).json(response)
}
