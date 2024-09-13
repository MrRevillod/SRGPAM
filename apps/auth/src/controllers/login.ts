
import { checkCredentials } from "../utils/credentials"
import { Administrator, Professional } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import { AccessTokenOpts, AppError, RefreshTokenOpts, signJsonwebtoken } from "@repo/lib"

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
	const loginKind = req.query.variant

	if (loginKind !== "ADMIN" && loginKind !== "PROFESSIONAL") {
		throw new AppError(400, "Invalid login kind")
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

		return res.status(200).json({ message: "Logged in", values: { user } })
	} catch (err) {
		next(err)
	}
}