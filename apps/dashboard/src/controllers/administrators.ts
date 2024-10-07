import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { deleteProfilePicture, uploadProfilePicture } from "../utils/files"
import { Administrator, Prisma } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import { AppError, constants, httpRequest, ServerTokens } from "@repo/lib"

// Controlador para obtener todos los administradores de la base de datos
// se excluye el campo password de la respuesta
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const administrators = await prisma.administrator.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				password: false,
				createdAt: true,
				updatedAt: true,
			},
		})

		return res.status(200).json({
			type: "success",
			values: { administrators, len: administrators.length },
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

			if (userExists?.id === id) conflicts.push("id")
			if (userExists?.email === email) conflicts.push("email")

			// Y se retornará un arreglo con los campos en conflicto
			throw new AppError(409, "El administrador ya existe", { conflicts })
		}

		// Se crea el administrador y se retorna la respuesta
		// excluyendo el campo password ya que no es un dato de dominio público

		const { password, ...administrator } = await prisma.administrator.create({
			data: { id, name, email, password: defaulAdminPassword },
		})

		return res.status(201).json({
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
	const id = req.params.id
	const user = req.getExtension("user") as Administrator

	try {
		const { name, email, password } = req.body

		const administrator = await prisma.administrator.update({
			where: { id: id },
			data: { name, email, password: password ? await hash(password, 10) : user.password },
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		const response = { updated: administrator, image: null }

		if (req.file) {
			// Extension "tokens" es un objeto de tipo ServerTokens
			// que contiene los tokens de acceso y/o refresco del usuario
			// que realiza la petición http

			const tokens = req.getExtension("tokens") as ServerTokens

			const storageResponse = await uploadProfilePicture({
				file: req.file,
				filename: req.params.id,
				endpoint: `/upload?path=%2Fusers%2F${req.params.id}`,
			})

			if (storageResponse.type === "error") {
				throw new AppError(storageResponse.status || 500, storageResponse.message)
			}

			response.image = storageResponse.values.image
		}

		return res.status(200).json({
			message: "Actualización exitosa",
			type: "success",
			values: response,
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para eliminar un administrador por su id
export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id

	try {
		await prisma.administrator.delete({ where: { id } })
		const endpint = `/delete?path=%2Fusers%2F${id}`

		const storageResponse = await deleteProfilePicture(endpint)

		if (storageResponse.type === "error") {
			throw new AppError(storageResponse.status || 500, storageResponse.message)
		}

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: { deletedId: id },
		})
	} catch (error) {
		next(error)
	}
}
