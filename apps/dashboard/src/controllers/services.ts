import { prisma } from "@repo/database"
import { fileToFormData } from "../utils/files"
import { AppError, httpRequest } from "@repo/lib"
import { Request, Response, NextFunction } from "express"

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const services = await prisma.service.findMany({
			select: { id: true, name: true, title: true, description: true },
		})

		return res.status(200).json({
			message: "Servicios obtenidos correctamente",
			type: "success",
			values: {
				services,
				len: services.length,
			},
		})
	} catch (error) {
		next(error)
	}
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, title, description } = req.body
		const file = req.file

		if (!file) {
			throw new AppError(400, "No se a enviado un archivo")
		}

		const serviceExists = await prisma.service.findFirst({
			where: { name },
		})

		if (serviceExists) {
			throw new AppError(409, "El servicio con ese nombre ya existe", { conflicts: ["name"] })
		}

		const service = await prisma.service.create({
			data: { name, title, description },
		})

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/upload?path=%2Fservices`,
			method: "POST",
			variant: "MULTIPART",
			body: fileToFormData(file, service.id.toString()),
		})

		if (response.type == "error") {
			await prisma.service.delete({ where: { id: service.id } })
			throw new AppError(response.status ?? 500, response.message)
		}

		return res.status(201).json({
			message: "Servicio creado correctamente",
			type: "success",
			values: service,
		})
	} catch (error) {
		next(error)
	}
}

export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params
		const { name, title, description } = req.body

		const service = await prisma.service.update({
			where: { id: Number(id) },
			data: { name, title, description },
			select: { id: true, name: true, title: true, description: true },
		})

		if (req.file) {
			const response = await httpRequest<null>({
				service: "STORAGE",
				endpoint: `/upload?path=%2Fservices`,
				method: "POST",
				variant: "MULTIPART",
				body: fileToFormData(req.file, service.id.toString()),
			})

			if (response.type == "error") {
				await prisma.service.delete({ where: { id: service.id } })
				throw new AppError(response.status ?? 500, response.message)
			}
		}

		return res.status(200).json({
			message: "Servicio actualizado exitosamente",
			type: "success",
			values: { updated: service },
		})
	} catch (error) {
		next(error)
	}
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id)

		const service = await prisma.service.findUnique({
			where: { id },
		})

		if (!service) throw new AppError(400, "El centro no existe")

		await prisma.professional.updateMany({
			where: { serviceId: id },
			data: { serviceId: null },
		})

		await prisma.service.delete({ where: { id } })

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/delete?path=%2Fservices%2F${service.id}.webp`,
			method: "DELETE",
			variant: "JSON",
			body: {},
		})

		if (response.type == "error") {
			throw new AppError(response.status ?? 500, response.message)
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
