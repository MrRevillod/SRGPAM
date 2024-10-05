import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"
import { io } from ".."

import { Prisma } from "@prisma/client"
import { canAddEvent } from "../utils/events"

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
			return res.status(409).json({
				message: "Professional no encontrado",
				type: "error",
			})
		}

		const service = await prisma.service.findUnique({
			where: { id: parseInt(serviceId) },
		})

		if (!service) {
			return res.status(409).json({
				message: "Servicio no encontrado",
				type: "error",
			})
		}

		if (seniorId) {
			const senior = await prisma.senior.findUnique({
				where: { id: seniorId },
			})

			if (!senior) {
				return res.status(409).json({
					message: "Adulto mayor no encontrado",
					type: "error",
				})
			}
		}

		if (centerId) {
			const center = await prisma.center.findUnique({
				where: { id: parseInt(centerId) },
			})

			if (!center) {
				return res.status(409).json({
					message: "Centro no encontrado",
					type: "error",
				})
			}
		}
		const eventSelect: Prisma.EventSelect = {
			startsAt: true,
			endsAt: true,
		}

		const events = await prisma.event.findMany({
			where: { professionalId: professionalId },
			select: eventSelect,
		})

		if (canAddEvent(events, { startsAt, endsAt })) {
			await prisma.event.create({
				data: {
					startsAt,
					endsAt,
					professionalId,
					serviceId: parseInt(serviceId),
					seniorId: seniorId || null,
					centerId: centerId ? parseInt(serviceId) : null,
				},
			})

			io.emit("newEvent", {
				startsAt,
				endsAt,
				professionalId,
				serviceId,
				centerId,
				seniorId,
			})
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
			return res.status(409).json({
				message: "Professional no encontrado",
				type: "error",
			})
		}

		const service = await prisma.service.findUnique({
			where: { id: serviceId },
		})

		if (!service) {
			return res.status(409).json({
				message: "Servicio no encontrado",
				type: "error",
			})
		}

		if (seniorId) {
			const senior = await prisma.senior.findUnique({
				where: { id: seniorId },
			})

			if (!senior) {
				return res.status(409).json({
					message: "Adulto mayor no encontrado",
					type: "error",
				})
			}
		}

		if (centerId) {
			const center = await prisma.center.findUnique({
				where: { id: centerId },
			})

			if (!center) {
				return res.status(409).json({
					message: "Centro no encontrado",
					type: "error",
				})
			}
		}

		const eventSelect: Prisma.EventSelect = {
			startsAt: true,
			endsAt: true,
		}

		const events = await prisma.event.findMany({
			where: { id: professionalId },
			select: eventSelect,
		})

		if (canAddEvent(events, { startsAt, endsAt })) {
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
				select: {
					seniorId: true,
					professionalId: true,
					serviceId: true,
					centerId: true,
					startsAt: true,
					endsAt: true,
					assistance: true,
					createdAt: true,
					updatedAt: true,
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
		await prisma.event.delete({ where: { id: parseInt(req.params.id) } })

		io.emit("deletedEvent", {
			id: parseInt(req.params.id),
		})

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: { deletedId: req.params.id },
		})
	} catch (error) {
		next(error)
	}
}
