import { RequestHandler } from "express"
import multer from "multer"

const storage = multer.memoryStorage()

export const upload = multer({ storage })

export const seniorsRegisterMobileImages: RequestHandler = upload.fields([
	{ name: "rut-a", maxCount: 1 },
	{ name: "rut-b", maxCount: 1 },
	{ name: "social", maxCount: 1 },
])
