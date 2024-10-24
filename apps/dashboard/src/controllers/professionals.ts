import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { AppError, constants } from "@repo/lib"
import { Prisma, Professional } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import { deleteProfilePicture, uploadProfilePicture } from "../utils/files"
import { generateSelect, generateWhere, ProfessionalQuery, professionalSelect } from "../utils/filters"

// Controlador de tipo select puede recibir un query para seleccionar campos específicos
// y para filtrar por claves foraneas

// Un ejemplo de query sería: /professionals?select=name,email&serviceId=1
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	// Se mapean los campos de la query where (filtro) a los campos de la base de datos
	const queryToWhereMap = { serviceId: (value: any) => ({ equals: Number(value) }) }
	const where = generateWhere<ProfessionalQuery>(req.query, queryToWhereMap)

	// Se mapean los campos de la query select a los campos de la base de datos
	// si no se envía un query select se seleccionan los campos por defecto
	const selectQuery = req.query.select?.toString()
	const select = generateSelect<Prisma.ProfessionalSelect>(selectQuery, professionalSelect)

	try {
		const professionals = await prisma.professional.findMany({ select, where })
		return res.status(200).json({ values: professionals })
	} catch (error) {
		next(error)
	}
}

// Controlador para crear un nuevo profesional
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, name, email, serviceId } = req.body
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

		if (!(await prisma.service.findFirst({ where: { id: serviceId } }))) {
			throw new AppError(409, "El servicio no existe", { conflicts: ["serviceId"] })
		}

		const professional = await prisma.professional.create({
			data: { id, name, email, password: DEFAULT_PASSWORD, serviceId },
			select: professionalSelect,
		})

		return res.status(201).json({ values: { modified: professional } })
	} catch (error) {
		next(error)
	}
}

// Controlador para Actualizar un profesional por su id
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	const user = req.getExtension("requestedUser") as Professional

	const { name, email, password } = req.body

	try {
		const userExists = await prisma.professional.findFirst({ where: { email } })

		if (userExists && userExists.id !== id) {
			throw new AppError(409, "El profesional ya existe", { conflicts: ["email"] })
		}

		const updatedPassword = password ? await hash(password, 10) : user.password

		const professional = await prisma.professional.update({
			where: { id },
			select: professionalSelect,
			data: { name, email, password: updatedPassword },
		})

		const response = { modified: professional, image: null }

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

		return res.status(200).json({ values: response })
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

		const deleted = await prisma.professional.delete({ where: { id: req.params.id } })
		const storageResponse = await deleteProfilePicture(`/delete?path=%2Fusers%2F${id}`)

		if (storageResponse.type === "error") {
			throw new AppError(500, "Error al eliminar la imagen del profesional")
		}

		return res.status(200).json({ values: { modified: deleted } })
	} catch (error) {
		next(error)
	}
}
