import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"
import { io } from ".."

import { canAddEvent } from "../utils/events"
import { AppError } from "@repo/lib"

// Controlador para obtener todos los administradores de la base de datos
// se excluye el campo password de la respuesta
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const Events = await prisma.event.findMany({
			select: {
				id: true,
				startsAt: true,
				endsAt: true,
				assistance: true,
				seniorId: true,
				professionalId: true,
				serviceId: true,
				centerId: true,
			},
		})

		return res.status(200).json({
			message: "Administradores obtenidos correctamente",
			type: "success",
			values: {
				Events,
				len: Events.length,
			},
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para crear un nuevo administrador
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { startsAt, endsAt, professionalId, serviceId, centerId, seniorId } = req.body

		const professional = await prisma.professional.findUnique({
			where: { id: professionalId },
		})

		if (!professional) {
			throw new AppError(400, "Profesional no encontrado")
		}

		const service = await prisma.service.findUnique({
			where: { id: parseInt(serviceId) },
		})

		if (!service) {
			throw new AppError(400, "Servicio no enconrado")
		}

		if (seniorId) {
			const senior = await prisma.senior.findUnique({
				where: { id: seniorId },
			})

			if (!senior) {
				throw new AppError(400, "Adulto mayor no encontrado")
			}
		}

		if (centerId) {
			const center = await prisma.center.findUnique({
				where: { id: parseInt(centerId) },
			})

			if (!center) {
				throw new AppError(400, "Centro no encontrado")
			}
		}
		// const eventSelect: Prisma.EventSelect = {
		// 	startsAt: true,
		// 	endsAt: true,
		// }

		const events = await prisma.event.findMany({
			where: { professionalId: professionalId },
		})

		if (
			canAddEvent(events, {
				startsAt: new Date(startsAt),
				endsAt: new Date(endsAt),
			})
		) {
			const event = await prisma.event.create({
				data: {
					startsAt,
					endsAt,
					professionalId,
					serviceId: parseInt(serviceId),
					seniorId: seniorId || null,
					centerId: centerId ? parseInt(serviceId) : null,
				},
			})

			//io.to("ADMIN").emit("newEvent", event) FUNCIONANDO
			//io.to("anyClientId").emit("newEvent", event) FUNCIONANDO

			return res.status(200).json({
				message: "Creación exitosa",
				type: "success",
			})
		} else {
			return res.status(409).json({
				message: "Superposición de horas",
				type: "error",
			})
		}
	} catch (error) {
		next(error)
	}
}

// Controlador para Actualizar un administrador por su id
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { seniorId, professionalId, serviceId, centerId, startsAt, endsAt, assistance } = req.body

		const professional = await prisma.professional.findUnique({
			where: { id: professionalId },
		})

		if (!professional) {
			throw new AppError(400, "Profesional no encontrado")
		}

		const service = await prisma.service.findUnique({
			where: { id: parseInt(serviceId) },
		})

		if (!service) {
			throw new AppError(400, "Servicio no encontrado")
		}

		if (seniorId) {
			const senior = await prisma.senior.findUnique({
				where: { id: seniorId },
			})

			if (!senior) {
				throw new AppError(400, "Adulto mayor no encontrado")
			}
		}

		if (centerId) {
			const center = await prisma.center.findUnique({
				where: { id: parseInt(centerId) },
			})

			if (!center) {
				throw new AppError(400, "Centro no encontrado")
			}
		}
		const events = await prisma.event.findMany({
            where: {
                professionalId: professionalId ,
                id: {
                    not: parseInt(req.params.id),  // Excluir el evento con el `id` específico
                },
            },
		})

		if (canAddEvent(events, {
            startsAt: new Date(startsAt),
            endsAt: new Date(endsAt),
        })) {
			const event = await prisma.event.update({
				where: { id: parseInt(req.params.id) },
				data: {
					startsAt,
					endsAt,
					professionalId,
					serviceId: parseInt(serviceId),
					centerId: centerId ? parseInt(serviceId) : null,
					seniorId: seniorId || null,
					assistance: assistance || false,
				},
			})

			io.emit("updatedEvent", event)

			return res.status(200).json({
				message: "Actualización exitosa",
				type: "success",
				values: { event },
			})
		} else {
			return res.status(409).json({
				message: "Superposición de horas",
				type: "error",
			})
		}
	} catch (error) {
		next(error)
	}
}

// Controlador para eliminar un administrador por su id
export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const event = await prisma.event.delete({ where: { id: parseInt(req.params.id) } })

		io.emit("deletedEvent", event)
		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: { deletedId: req.params.id },
		})
	} catch (error) {
		next(error)
	}
}
