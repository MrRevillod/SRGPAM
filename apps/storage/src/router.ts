import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"
import multer from "multer"
import express from "express"

import { mkdir } from "node:fs/promises"
import { AppError } from "@repo/lib"

const router: express.Router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

type Query = { path: string | undefined }
type File = Express.Multer.File

router.post("/upload", upload.array("files"), async (req, res, next) => {
	const query: Query = req.query as Query
	const files: File[] = req.files as File[]

	const allowedPaths = ["seniors", "users", "services", "centers"]

	try {
		if (!query.path) throw new AppError(400, "Path is required")

		if (!allowedPaths.includes(query.path.split("/")[1])) {
			throw new AppError(400, "Invalid path")
		}

		const storagePath = path.join(__dirname, `../public/${query.path}`)

		if (!fs.existsSync(storagePath)) {
			await mkdir(storagePath, { recursive: true })
		}

		const uploadPromises = files.map(async (file) => {
			const filename = file.originalname.split(".")[0]
			const filePath = path.join(storagePath, `${filename}.webp`)
			await sharp(file.buffer).webp({ quality: 80 }).toFile(filePath)
		})

		await Promise.all(uploadPromises)
		return res.status(200).json({ message: "Files uploaded" })
	} catch (error: any) {
		next(error)
	}
})

router.delete("/delete", async (req, res, next) => {
	const query: Query = req.query as Query

	try {
		if (!query.path) throw new AppError(400, "Path is required")
		const storagePath = path.join(__dirname, `../public/${query.path}`)
		if (fs.existsSync(storagePath)) {
			fs.rmSync(storagePath, { recursive: true })
		}

		return res.status(200).json({ message: "Files deleted" })
	} catch (error: any) {
		next(error)
	}
})

export default router
