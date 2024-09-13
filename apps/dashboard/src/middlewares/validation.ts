import { z } from "zod"
import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { AppError, UserKind } from "@repo/lib"
import { adminSchema, registerSchema } from "./schemas"
import { Request, Response, NextFunction } from "express"

export const userIdValidation = (userKind: UserKind) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params

		try {
			if (!id) throw new AppError(400, "El usuario solicitado no existe")

			const user = await match(userKind)
				.with("ADMIN", async () => {
					return await prisma.administrator.findUnique({ where: { id } })
				})
				.with("SENIOR", async () => {
					return await prisma.senior.findUnique({ where: { id } })
				})
				.with("PROFESSIONAL", async () => {
					return await prisma.professional.findUnique({ where: { id } })
				})
				.run()

			if (!user) throw new AppError(400, "El usuario solicitado no existe")

			req.setExtension("user", user)

			next()
		} catch (error) {
			next(error)
		}
	}
}

export const seniorValidation = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await registerSchema.parseAsync(req.body)
		next()
	} catch (error) {
		let err = error
		if (err instanceof z.ZodError) {
			err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
		}
		return res.status(409).json({
			message: "Argumentos inválidos",
		})
	}
}

export const adminValidation = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await adminSchema.parseAsync(req.body)
		next()
	} catch (error) {
		let err = error
		if (err instanceof z.ZodError) {
			err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
		}
		return res.status(409).json({
			message: error,
		})
	}
}
