import { prisma } from "@repo/database"
import { AppError, verifyJsonwebtoken, AccessTokenOpts, UserKind } from "@repo/lib"
import { NextFunction, Request, Response } from "express"

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessCookie = req.cookies["ACCESS_TOKEN"]

		const authHeader = req.headers.authorization
		let accessHeaderToken = null

		if (authHeader && authHeader.startsWith("Bearer ")) {
			accessHeaderToken = authHeader.split("Bearer ")[1].split(",")[0].trim()
		}

		const accessToken = accessCookie || accessHeaderToken

		if (!accessToken) throw new AppError(401, "No tienes autorización para acceder a este recurso")

		const payload = verifyJsonwebtoken(accessToken, AccessTokenOpts)

		req.setExtension("userId", payload.id)

		const [admin, professional, senior] = await Promise.all([
			prisma.administrator.findUnique({ where: { id: payload.id } }),
			prisma.professional.findUnique({ where: { id: payload.id } }),
			prisma.senior.findUnique({ where: { id: payload.id } }),
		])

		if (!admin && !professional && !senior) {
			throw new AppError(401, "No tienes autorización para acceder a este recurso")
		}

		const role: UserKind = admin ? "ADMIN" : professional ? "PROFESSIONAL" : "SENIOR"

		req.setExtension("user", admin || professional || senior)
		req.setExtension("role", role)

		next()
	} catch (error) {
		next(error)
	}
}

export const authenticationByRole = (requiredRole: UserKind) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = req.getExtension("user")
		const role = req.getExtension("role")

		if (role !== requiredRole) {
			throw new AppError(403, "No tienes permisos para acceder a este recurso")
		}

		next()
	}
}
