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
	const user = req.getExtension("user") as Professional
	const id = req.params.id

	try {
		const { name, email, password } = req.body

		const professional = await prisma.professional.update({
			where: { id },
			data: { name, email, password: password ? await hash(password, 10) : user.password },
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
			// Remover depues de integrar middleware de pertenenencia

			const tokens = getServerTokens(req.headers, req.cookies)

			const authResponse = await httpRequest({
				service: "AUTH",
				endpoint: "/validate-auth",
				method: "GET",
				headers: {
					Authorization: `Bearer ${tokens?.access || null}`,
				},
			})

			if (authResponse.type === "error") {
				throw new AppError(authResponse.status || 500, authResponse.message)
			}

			// --------------------

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

// Controlador para eliminar un profesional por su id !FALTA CORREGIR PERTENENCIA
export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	// Extension "tokens" es un objeto de tipo ServerTokens
	// que contiene los tokens de acceso y/o refresco del usuario
	// que realiza la petición http

	const id = req.params.id

	try {
		// Remover depues de integrar middleware de pertenenencia

		const tokens = getServerTokens(req.headers, req.cookies)

		const authResponse = await httpRequest({
			service: "AUTH",
			endpoint: "/validate-auth",
			method: "GET",
			headers: {
				Authorization: `Bearer ${tokens?.access || null}`,
			},
		})

		if (authResponse.type === "error") {
			throw new AppError(authResponse.status || 500, authResponse.message)
		}

		// --------------------

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
