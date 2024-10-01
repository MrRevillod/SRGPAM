import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import cookieParser from "cookie-parser"
import { createServer } from "http"

import { Server } from "socket.io"

import administrarorsRouter from "./routes/administrators"
import professionalsRouter from "./routes/professionals"
import seniorsRouter from "./routes/seniors"
import eventsRouter from "./routes/events"

import { log, services, errorHandler, extensions } from "@repo/lib"
import { ServerToClientEvents } from "./socket"
import { initSocket } from "./utils/socket"

export const createServer_ = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(cors())
	app.use(cookieParser())

	app.use(extensions)
	app.use("/api/dashboard/professionals", professionalsRouter)
	app.use("/api/dashboard/administrators", administrarorsRouter)
	app.use("/api/dashboard/seniors", seniorsRouter)
	app.use("/api/dashboard/events", eventsRouter)

	app.use(errorHandler)
	return app
}

const server = createServer_()

const http = createServer(server)

export const io = new Server<ServerToClientEvents>(http, {
    cors: {
        origin: "*",
        methods: ["GET","POST"],

    }
})
initSocket(io)

http.listen(services.DASHBOARD.port, () => {
	log(`Dashboard service running on ${services.DASHBOARD.port}`)
})
