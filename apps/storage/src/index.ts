import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import multer from "multer"
import express, { Router } from "express"
import { existsSync, mkdirSync } from "fs"
import { log, config, errorHandler, extensions, JsonResponse } from "@repo/lib"
import path from "path"

export const createServer = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(cors())

	app.use(extensions)
	app.use(router)
	app.use(errorHandler)

	return app
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = `public/${req.params["id"]}`

		//Crear directorio personal
		if (!existsSync(dir)) {
			mkdirSync(dir)
		}
		cb(null, "public/" + req.params["id"] + "/")
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
		const ext = path.extname(file.originalname)
		cb(null, file.fieldname + "-" + uniqueSuffix + ext)
	},
})
const upload = multer({ storage })

const router: Router = Router()
router.post("/api/storage/seniors/:id", upload.single("file"), (req, res) => {
	const response: JsonResponse = {
		message: "Upload sucess",
		type: "success",
		values: null,
	}
	return res.status(200).json(response)
})

router.delete("/api/storage/seniors/:id", async (req, res, next) => {
	const response: JsonResponse = {
		message: "delete route correct",
		type: "success",
		values: null,
	}
	return res.status(200).json(response)
})

const server = createServer()
server.listen(config.api_port, () => {
	log(`Storage running on ${config.api_port}`)
})
