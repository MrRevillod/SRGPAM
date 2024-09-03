import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"

import administrarorsRouter from "./routes/administrators"
import professionalsRouter from "./routes/professionals"
import seniorsRouter from "./routes/seniors"

import { log, services, errorHandler, extensions } from "@repo/lib"

export const createServer = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(cors())

	app.use(extensions)
	app.use("/api/dashboard/professionals", professionalsRouter)
	app.use("/api/dashboard/administrators", administrarorsRouter)
	app.use("/api/dashboard/seniors", seniorsRouter)
	app.use(errorHandler)

	return app
}

const server = createServer()

server.listen(services.DASHBOARD.port, () => {
	log(`Dashboard service running on ${services.DASHBOARD.port}`)
})
