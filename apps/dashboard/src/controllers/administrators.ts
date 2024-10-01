import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { constants } from "@repo/lib"
import { Administrator, Prisma } from "@prisma/client"
import { Request, Response, NextFunction } from "express"

// Controlador para obtener todos los administradores de la base de datos
// se excluye el campo password de la respuesta
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const administrators = await prisma.administrator.findMany({
			select: { id: true, name: true, email: true, password: false, createdAt: true, updatedAt: true },
		})

		return res.status(200).json({
			message: "Administradores obtenidos correctamente",
			type: "success",
			values: {
				administrators,
				len: administrators.length,
			},
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para crear un nuevo administrador
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, name, email } = req.body
		const defaulAdminPassword = await hash(constants.DEFAULT_ADMIN_PASSWORD, 10)

		// Verificamos si el administrador ya existe

		const filter: Prisma.AdministratorWhereInput = {
			OR: [{ id }, { email }],
		}

		const userExists = await prisma.administrator.findFirst({ where: filter })

		if (userExists) {
			const conflicts = []

			// Si el admin ya existe se verificará que campo está en conflicto

			if (userExists?.id === id) {
				conflicts.push("id")
			}

			if (userExists?.email === email) {
				conflicts.push("email")
			}

			// Y se retornará un arreglo con los campos en conflicto

			return res.status(409).json({
				message: "El administrador ya existe",
				type: "error",
				values: { conflicts },
			})
		}

		const { password, ...administrator } = await prisma.administrator.create({
			data: { id, name, email, password: defaulAdminPassword },
		})

		return res.status(200).json({
			message: "Creación exitosa",
			type: "success",
			values: administrator,
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para Actualizar un administrador por su id
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	const reqUser = req.getExtension("user") as Administrator

	try {
		const { name, email, password } = req.body

		const user = await prisma.administrator.update({
			where: { id: req.params.id },
			data: { name, email, password: password ? await hash(password, 10) : reqUser.password },
			select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
		})

		return res.status(200).json({
			message: "Actualización exitosa",
			type: "success",
			values: user,
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para eliminar un administrador por su id
export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await prisma.administrator.delete({ where: { id: req.params.id } })

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: { deletedId: req.params.id },
		})
	} catch (error) {
		next(error)
	}
}
