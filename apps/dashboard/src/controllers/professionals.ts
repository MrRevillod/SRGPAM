import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { constants, findUser } from "@repo/lib"
import { Request, Response, NextFunction } from "express"
import { Professional } from "@prisma/client"

// Controlador para obtener todos los profesionales de la base de datos
// se excluye el campo password de la respuesta
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const professionals = await prisma.professional.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				password: false,
			},
		})

		return res.status(200).json({
			message: "Profesionales obtenidos correctamente",
			type: "success",
			values: {
				professionals,
				len: professionals.length,
			},
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para crear un nuevo profesional
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, name, email } = req.body
		const defaulAdminPassword = await hash(constants.DEFAULT_PROFESSIONAL_PASSWORD, 10)

		// Verificamos si el profesional ya existe

		const userExists = await findUser({ id, email }, "PROFESSIONAL")
		if (userExists) {
			const conflicts = []

			// Si el profesional ya existe se verificará que campo está en conflicto

			if (userExists?.id === id) conflicts.push("id")
			if (userExists?.email === email) conflicts.push("email")

			// Y se retornará un arreglo con los campos en conflicto

			return res.status(409).json({
				message: "El profesional ya existe",
				type: "error",
				values: conflicts,
			})
		}

		await prisma.administrator.create({
			data: {
				id,
				name,
				email,
				password: defaulAdminPassword,
			},
		})

		return res.status(200).json({
			message: "Creación exitosa",
			type: "success",
			values: null,
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para Actualizar un profesional por su id
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	const reqUser = req.getExtension("user") as Professional

	try {
		const { name, email, password } = req.body

		const user = await prisma.professional.update({
			where: { id: req.params.id },
			data: {
				name,
				email,
				password: password ? await hash(password, 10) : reqUser.password,
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		})

		return res.status(200).json({
			message: "Actualización exitosa",
			type: "success",
			values: { user },
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para eliminar un profesional por su id
export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await prisma.professional.delete({ where: { id: req.params.id } })

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: null,
		})
	} catch (error) {
		next(error)
	}
}
