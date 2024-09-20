import { checkCredentials } from "../utils/credentials"
import { Administrator, Professional, Senior } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import { AccessTokenOpts, AppError, RefreshTokenOpts, signJsonwebtoken, toPublicUser } from "@repo/lib"

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
	const loginKind = req.query.variant

	if (loginKind !== "ADMIN" && loginKind !== "PROFESSIONAL") {
		throw new AppError(400, "Inicio de sesión inválido")
	}

	const expireDate = new Date()
	expireDate.setTime(expireDate.getTime() + 15 * 60 * 1000)

	const refreshDate = new Date()
	refreshDate.setDate(refreshDate.getDate() + 30)

	try {
		const user: Administrator | Professional = await checkCredentials(loginKind, req.body)

		const accessToken = signJsonwebtoken({ id: user.id }, AccessTokenOpts)
		const refreshToken = signJsonwebtoken({ id: user.id }, RefreshTokenOpts)

		res.cookie("ACCESS_TOKEN", accessToken, { expires: expireDate, httpOnly: true, path: "/" })
		res.cookie("REFRESH_TOKEN", refreshToken, { expires: refreshDate, httpOnly: true, path: "/" })

		return res.status(200).json({
			message: "Has iniciado sesión correctamente",
			type: "success",
			values: { user: toPublicUser(user) },
		})
	} catch (error) {
		next(error)
	}
}

export const loginSeniorMobile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: Senior = await checkCredentials("SENIOR", req.body)
		if (!user.validated) {
			throw new AppError(401, "Su cuenta aun no ha sido validada")
		}
		const accessToken = signJsonwebtoken({ id: user.id }, AccessTokenOpts)
		const refreshToken = signJsonwebtoken({ id: user.id }, RefreshTokenOpts)
		const publicUser = toPublicUser(user)

		return res.status(200).json({ message: "Inicio de sesión correcto", type: "success", values: { accessToken, refreshToken, publicUser } })
	} catch (error: unknown) {
		next(error)
	}
}
