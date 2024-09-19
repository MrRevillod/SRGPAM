import { prisma } from "@repo/database"
import { AppError, verifyJsonwebtoken, AccessTokenOpts, UserKind } from "@repo/lib"
import { NextFunction, Request, Response } from "express"
import { match } from "ts-pattern"

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessCookie = req.cookies["ACCESS_TOKEN"]
		if (!accessCookie) throw new AppError(401, "No tienes autorizacion para acceder a este recurso")

		const accessToken = accessCookie
		const payload = verifyJsonwebtoken(accessToken, AccessTokenOpts)
		req.setExtension("userId", payload.id)
		next()
	} catch (error) {
		next(error)
	}
}

export const authenticationByRole = (requiredRole: UserKind) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.getExtension("userId") as string

			if (!userId) throw new AppError(401, "No se pudo determinar el usuario")

			const [admin, senior, professional] = await Promise.all([
				prisma.administrator.findUnique({ where: { id: userId } }),
				prisma.senior.findUnique({ where: { id: userId } }),
				prisma.professional.findUnique({ where: { id: userId } }),
			])

			const role: UserKind = admin ? "ADMIN" : senior ? "SENIOR" : "PROFESSIONAL"

			const user = admin || senior || professional

			req.setExtension("role", role)
			req.setExtension("user", user)

			next()
		} catch (error) {
			next(error)
		}
	}
}
