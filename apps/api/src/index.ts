import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"

import router from "./routes/users"

import { log, errorHandler, extensions, services } from "@repo/lib"

export const createServer = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(cors())

	app.use(extensions)
	app.use(router)
	app.use(errorHandler)

	return app
}

const server = createServer()

server.listen(9999, () => {
	log(`api running on ${9999}`)
})
