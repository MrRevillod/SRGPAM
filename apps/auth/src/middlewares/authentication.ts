import { AppError, verifyJsonwebtoken, AccessTokenOpts } from "@repo/lib"
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

		next()
	} catch (error) {
		next(error)
	}
}
