import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { compare, hash } from "bcrypt"
import { Administrator } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import { AccessTokenOpts, AuthError, signJsonwebtoken, UserKind } from "@repo/lib"

type Credentials = {
	rut?: string
	email?: string
	password: Required<string>
}

const checkCredentials = async <T>(userKind: UserKind, credentials: Credentials) => {
	const user = await match(userKind)
		.with("ADMIN", async () => {
			return await prisma.administrator.findFirst({ where: { email: credentials.email } })
		})
		.with("SENIOR", async () => {
			return await prisma.senior.findFirst({ where: { id: credentials.rut } })
		})
		.run()

	if (!user || !(await compare(credentials.password, user.password))) {
		throw new AuthError(401, "Invalid credentials")
	}

	return user as T
}

export const administratorsLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(req.cookies)
		console.log(req.body)

		const user: Administrator = await checkCredentials("ADMIN", req.body)
		const access = signJsonwebtoken({ id: user.id }, AccessTokenOpts)
		const refresh = signJsonwebtoken({ id: user.id }, AccessTokenOpts)

		res.cookie("access", access, { httpOnly: true, sameSite: "strict" })
		res.cookie("refresh", refresh, { httpOnly: true, sameSite: "strict" })

		console.log("pasó")

		return res.status(200).json({ message: "Logged in" })
	} catch (err) {
		next(err)
	}
}

export const professionalsLogin = async (req: Request, res: Response, next: NextFunction) => {}
export const seniorsLogin = async (req: Request, res: Response, next: NextFunction) => {}
