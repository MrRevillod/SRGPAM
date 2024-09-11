import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { AppError } from "@repo/lib"
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
		console.log("Inicio del middleware")
		const administratorsById = await prisma.administrator.findUnique({
			where: {
				id: req.params.id,
			},
		})
		if (!administratorsById) {
			throw new AppError(404, "El recurso solicitado no existe")
		}
		console.log("Medio del middleware")
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
			message: "Administrador Creado Correctamente ",
			type: "success",
			values: createAdministrator,
		})
	} catch (error) {
		next(error)
	}
}

export const updateAdministrator = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password } = req.body
		const defaulAdminPassword = await hash(password, 10)

		await prisma.administrator.update({
			where: { id: req.params.id },

			data: { name, email, password: defaulAdminPassword },
		})

		return res.status(200).json({
			message: "Administrador Actualizado Correctamente ",
			type: "success",
			values: null,
		})
	} catch (error) {
		next(error)
	}
}

export const deleteAdministrator = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await prisma.administrator.delete({ where: { id: req.params.id } })

		return res.status(200).json({
			message: "Administradores Eliminado Correctamente ",
			type: "success",
			values: null,
		})
	} catch (error) {
		next(error)
	}
}
