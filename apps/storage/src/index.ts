import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import { log, config, errorHandler, extensions } from "@repo/lib"
import { router } from "./router"

export const createServer = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(cors())
	app.use(extensions)
	app.use("/api/storage/seniors", router)
	app.use(errorHandler)

	return app
}

const server = createServer()

server.listen(config.api_port, () => {
	log(`Storage running on ${config.api_port}`)
})
