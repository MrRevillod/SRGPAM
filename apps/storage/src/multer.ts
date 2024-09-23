import multer from "multer"
import { RequestHandler } from "express"

const storage = multer.memoryStorage()

const upload = multer({ storage })

export const uploadFields: RequestHandler = upload.fields([
	{ name: "dni-a", maxCount: 1 },
	{ name: "dni-b", maxCount: 1 },
	{ name: "social", maxCount: 1 },
])

export const uploadProfile: RequestHandler = upload.single("profile")
