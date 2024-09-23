import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"

import { router } from "./router"
import { log, services, errorHandler, extensions } from "@repo/lib"
import { validateCors } from "./middlewares"

export const createServer = (): express.Express => {
	const app = express()

	app.use(express.static("public"))
	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(cors())
	app.use(extensions)
	app.use(validateCors)
	app.use("/api/storage/seniors", router)
	app.use(errorHandler)

	return app
}

const server = createServer()

server.listen(services.STORAGE.port, () => {
	log(`Storage running on ${services.STORAGE.port}`)
})
