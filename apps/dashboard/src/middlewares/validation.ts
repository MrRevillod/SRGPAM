import { Request, Response, NextFunction } from "express"
import { prisma } from "@repo/database"
import { AppError } from "@repo/lib"
import { registerSchema } from "./seniors"
import { z } from "zod"

export const userIdValidation = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.params.id) {
			throw new AppError(400, "El recurso solicitado no existe")
		}

		const exist = await prisma.administrator.findUnique({
			where: { id: req.params.id },
		})

		if (!exist) {
			throw new AppError(400, "El recurso solicitado no existe")
		}
		next()
	} catch (error) {
		next(error)
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

