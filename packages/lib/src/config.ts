import dotenv from "dotenv"
import { ServiceName, ServiceInfo } from "./types"

dotenv.config({ path: "../../.env" })

const envPortAsInt = (envVar: string, defaultPort: number) => {
	return parseInt(process.env[envVar] ?? defaultPort.toString())
}

export const services: Record<ServiceName, ServiceInfo> = {
	AUTH: {
		url: (process.env.AUTH_SERVICE_URL ?? "http://localhost") as string,
		port: envPortAsInt("AUTH_SERVICE_PORT", 3000),
	},
	DASHBOARD: {
		url: (process.env.DASHBOARD_SERVICE_URL ?? "http://localhost") as string,
		port: envPortAsInt("DASHBOARD_SERVICE_PORT", 4000),
	},
	STORAGE: {
		url: (process.env.STORAGE_SERVICE_URL ?? "http://localhost") as string,
		port: envPortAsInt("STORAGE_SERVICE_PORT", 5000),
	},
	ADMIN_WEB: {
		url: (process.env.ADMIN_WEB_SERVICE_URL ?? "http://localhost") as string,
		port: envPortAsInt("ADMIN_WEB_SERVICE_PORT", 8000),
	},
	PRO_WEB: {
		url: (process.env.PRO_WEB_SERVICE_URL ?? "http://localhost") as string,
		port: envPortAsInt("PRO_WEB_SERVICE_PORT", 9000),
	},
}

export const constants = {
	JWT_SECRET: process.env.JWT_SECRET ?? "secret",
}

console.table(services)
