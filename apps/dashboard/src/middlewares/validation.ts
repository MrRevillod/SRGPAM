import { Request, Response, NextFunction } from "express"
import { prisma } from "@repo/database"
import { AppError } from "@repo/lib"

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
