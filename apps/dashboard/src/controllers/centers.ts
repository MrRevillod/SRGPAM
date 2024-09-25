import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const centers = await prisma.center.findMany({
			select: {
				id: true,
				name: true,
				address: true,
				phone: false,
			},
		})

		return res.status(200).json({
			message: "Centros obtenidos correctamente",
			type: "success",
			values: {
				centers,
				len: centers.length,
			},
		})
	} catch (error) {
		next(error)
	}
}
