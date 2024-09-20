import { Request, Response, NextFunction } from "express"
import { AccessTokenOpts, RefreshTokenOpts } from "@repo/lib"
import { AppError, JsonResponse, signJsonwebtoken, verifyJsonwebtoken } from "@repo/lib"

export const validateSession = (req: Request, res: Response, next: NextFunction) => {
	const user = req.getExtension("user")

	const response: JsonResponse<any> = {
		type: "success",
		values: { user },
		message: "Usuario autenticado",
	}

	return res.status(200).json(response)
}

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const refreshToken = req.cookies["REFRESH_TOKEN"]
		if (!refreshToken) {
			throw new AppError(401, "No autorizado")
		}

		const payload = verifyJsonwebtoken(refreshToken, RefreshTokenOpts)
		const newAccessToken = signJsonwebtoken({ id: payload.id }, AccessTokenOpts)

		const expireDate = new Date()
		expireDate.setTime(expireDate.getTime() + 15 * 60 * 1000)

		res.cookie("ACCESS_TOKEN", newAccessToken, {
			expires: expireDate,
			httpOnly: true,
			path: "/",
		})

		return res.status(200).json({
			message: "Token de acceso actualizado",
			type: "success",
			values: null,
		})
	} catch (error) {
		next(error)
	}
}
