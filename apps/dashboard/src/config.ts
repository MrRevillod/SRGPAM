import multer from "multer"
import { RequestHandler } from "express"

const storage = multer.memoryStorage()

export const upload = multer({ storage })

export const seniorsRegisterMobileImages: RequestHandler = upload.fields([
	{ name: "dni-a", maxCount: 1 },
	{ name: "dni-b", maxCount: 1 },
	{ name: "social", maxCount: 1 },
])
