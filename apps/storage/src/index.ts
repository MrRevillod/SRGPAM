import cors from "cors"
import path from "node:path"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"

import { router } from "./router"
import { validateCors } from "./middlewares"
import { log, services, errorHandler, extensions } from "@repo/lib"

export const createServer = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(cors())
	app.use(extensions)
	app.use(validateCors)

	app.use("/api/storage/seniors", router)
	app.use("/api/storage/", express.static(path.join(__dirname, "../public")))

	app.use(errorHandler)
	return app
}

const server = createServer()

server.listen(services.STORAGE.port, () => {
	log(`Storage running on ${services.STORAGE.port}`)
})
