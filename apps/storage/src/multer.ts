import { NextFunction, RequestHandler } from "express"
import { existsSync, mkdirSync } from "fs"
import multer from "multer"
import path from "path"

export const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = `public/${req.params["id"]}`

		//Crear directorio personal
		if (!existsSync(dir)) {
			mkdirSync(dir)
		}
		cb(null, "public/" + req.params["id"] + "/")
	},

	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		cb(null, file.fieldname + ext)
	},
})

const upload = multer({ storage })

export const uploadFields: RequestHandler = upload.fields([
	{ name: "profile", maxCount: 1 },
	{ name: "rut-a", maxCount: 1 },
	{ name: "rut-b", maxCount: 1 },
	{ name: "social", maxCount: 1 },
])
