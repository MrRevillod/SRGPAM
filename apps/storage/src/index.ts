import fs from "node:fs"
import cors from "cors"
import path from "node:path"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import router from "./router"

import { log, services, errorHandler, constants, AppError } from "@repo/lib"

// Sistema de archivos de el microservicio de almacenamiento

// /public | /var/www/public (desarrollo | producción)

// -- /seniors
// ---- /id
// ------ dni-a.jpg
// ------ dni-b.jpg
// ------ social.jpg
// ------ profile.jpg

// -- /users
// ---- profile-id.jpg
// ---- profile-default.jpg

// -- /services
// ---- image-id.jpg

// -- /centers
// ---- image-id.jpg

// Las imagenes son transformadas a formato webp con calidad 80
// Un upload de una imagen con el mismo nombre sobreescribe la anterior

const initFileSystem = (): void => {
	// __dirname => directorio actual
	const publicPath = path.join(__dirname, "../public")
	const seniorsPath = path.join(publicPath, "seniors")
	const usersPath = path.join(publicPath, "users")
	const servicesPath = path.join(publicPath, "services")
	const centersPath = path.join(publicPath, "centers")

	const paths = [publicPath, seniorsPath, usersPath, servicesPath, centersPath]

	paths.forEach((path) => {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true })
		}
	})
}

export const createServer = (): express.Express => {
	initFileSystem()
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(cors())

	app.use((req, res, next) => {
		if (req.headers["x-storage-key"] !== constants.STORAGE_KEY) {
			next(new AppError(403, "No tiene permisos para acceder al servicio"))
		}
		next()
	})

	app.use("/api/storage/", router)
	app.use("/api/storage/public", express.static(path.join(__dirname, "../public")))

	app.use(errorHandler)
	return app
}

const server = createServer()

server.listen(services.STORAGE.port, () => {
	log(`Storage running on ${services.STORAGE.port}`)
})
