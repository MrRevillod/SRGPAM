import { Administrator, Professional } from "@prisma/client"
import { checkCredentials } from "../utils/credentials"
import { Request, Response, NextFunction } from "express"
import { signJsonwebtoken, AccessTokenOpts, RefreshTokenOpts } from "@repo/lib"

export const administratorsLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const expireDate = new Date()
		expireDate.setTime(expireDate.getTime() + 15 * 60 * 1000)
		const refreshDate = new Date()
		refreshDate.setDate(refreshDate.getDate() + 30)

		const user: Administrator = await checkCredentials("ADMIN", req.body)

		const accessToken = signJsonwebtoken({ id: user.id, role: "ADMIN" }, AccessTokenOpts)
		const refreshToken = signJsonwebtoken({ id: user.id, role: "ADMIN" }, RefreshTokenOpts)

		res.cookie("ACCESS_TOKEN", accessToken, { expires: expireDate, httpOnly: true, path: "/" })
		res.cookie("REFRESH_TOKEN", refreshToken, { expires: refreshDate, httpOnly: true, path: "/" })

		return res.status(200).json({ message: "Logged in", values: { user } })
	} catch (err) {
		next(err)
	}
}

export const professionalsLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const expireDate = new Date()
		expireDate.setTime(expireDate.getTime() + 15 * 60 * 1000)
		const refreshDate = new Date()
		refreshDate.setDate(refreshDate.getDate() + 30)

		const user: Professional = await checkCredentials("PROFESSIONAL", req.body)

		const accessToken = signJsonwebtoken({ id: user.id, role: "PROFESSIONAL" }, AccessTokenOpts)
		const refreshToken = signJsonwebtoken({ id: user.id, role: "PROFESSIONAL" }, RefreshTokenOpts)

		res.cookie("ACCESS_TOKEN", accessToken, { expires: expireDate, httpOnly: true, path: "/" })
		res.cookie("REFRESH_TOKEN", refreshToken, { expires: refreshDate, httpOnly: true, path: "/" })

		return res.status(200).json({ message: "Logged in ", values: { user }, accessToken, refreshToken })
	} catch (error) {
		next(error)
	}
}
export const seniorsLogin = async (req: Request, res: Response, next: NextFunction) => {}
