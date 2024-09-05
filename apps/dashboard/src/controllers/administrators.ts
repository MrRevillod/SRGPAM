import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"

export const getAdministrators = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const administrators = await prisma.administrator.findMany()
		return res.status(200).json({
			message: "Administradores obtenidos correctamente",
			type: "success",
			values: administrators,
		})
	} catch (error) {
		next(error)
	}
}

export const getAdministratorById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const administratorsById = await prisma.administrator.findUnique({
			where: {
				id: req.params.id,
			},
		})
		return res.status(200).json({
			message: "Administradores obtenidos correctamente por id ",
			type: "success",
			values: administratorsById,
		})
	} catch (error) {
		next(error)
	}
}

export const createAdministrator = async (req: Request, res: Response, next: NextFunction) => {
	console.log(req.body)
	try {
		const { id, name, email } = req.body
		const defaulAdminPassword = await hash("admin123", 10)

		const createAdministrator = await prisma.administrator.create({
			data: {
				id,
				name,
				email,
				password: defaulAdminPassword,
			},
		})
		return res.status(200).json({
			message: "Administradores Creado correctamente ",
			type: "success",
			values: createAdministrator,
		})
	} catch (error) {
		next(error)
	}
}
