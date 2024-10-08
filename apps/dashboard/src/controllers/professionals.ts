import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { Prisma, Professional } from "@prisma/client"
import { deleteProfilePicture, uploadProfilePicture } from "../utils/files"
import { Request, Response, NextFunction } from "express"
import { AppError, constants, getServerTokens, httpRequest } from "@repo/lib"

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
				serviceId: true,
				updatedAt: true,
				createdAt: true,
				service: { select: { name: true } },
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
		const DEFAULT_PASSWORD = await hash(constants.DEFAULT_PROFESSIONAL_PASSWORD, 10)

		// Verificamos si el profesional ya existe

		const filter: Prisma.ProfessionalWhereInput = {
			OR: [{ id }, { email }],
		}

		const userExists = await prisma.professional.findFirst({ where: filter })

		if (userExists) {
			const conflicts = []

			// Si el profesional ya existe se verificará que campo está en conflicto

			if (userExists?.id === id) conflicts.push("id")
			if (userExists?.email === email) conflicts.push("email")

			// Y se retornará un arreglo con los campos en conflicto
			throw new AppError(409, "El profesional ya existe", { conflicts })
		}

		const professional = await prisma.professional.create({
			data: { id, name, email, password: DEFAULT_PASSWORD },
			select: {
				id: true,
				name: true,
				email: true,
				password: false,
				updatedAt: true,
				createdAt: true,
				service: {
					select: { name: true },
				},
			},
		})

		return res.status(201).json({
			message: "Creación exitosa",
			type: "success",
			values: professional,
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para Actualizar un profesional por su id
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.getExtension("requestedUser") as Professional
	const id = req.params.id

	try {
		const { name, email, password } = req.body
		const updatedPassword = password ? await hash(password, 10) : user.password

		const professional = await prisma.professional.update({
			where: { id },
			data: { name, email, password: updatedPassword },
			select: {
				id: true,
				name: true,
				email: true,
				password: false,
				serviceId: true,
				updatedAt: true,
				createdAt: true,
				service: {
					select: { name: true },
				},
			},
		})

		const response = { updated: professional, image: null }

		if (req.file) {
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

// Controlador para eliminar un profesional por su id
export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id

	try {
		await prisma.event.updateMany({
			where: { professionalId: req.params.id },
			data: { professionalId: null },
		})

		await prisma.professional.delete({ where: { id: req.params.id } })
		const endpint = `/delete?path=%2Fusers%2F${id}`

		const storageResponse = await deleteProfilePicture(endpint)

		if (storageResponse.type === "error") {
			throw new AppError(500, "Error al eliminar la imagen del profesional")
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
