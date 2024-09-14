import { AppError, verifyJsonwebtoken, AccessTokenOpts } from "@repo/lib"
import { NextFunction, Request, Response } from "express"

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
