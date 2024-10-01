import { prisma } from "@repo/database"
import { bufferToBlob } from "../utils/files"
import { Request, Response, NextFunction } from "express"
import { AppError } from "@repo/lib"

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const centers = await prisma.center.findMany({
			select: {
				id: true,
				name: true,
				address: true,
				phone: true,
			},
		})

		return res.status(200).json({
			message: "Centros obtenidos correctamente",
			type: "success",
			values: {
				centers,
				len: centers.length,
			},
		})
	} catch (error) {
		next(error)
	}
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, address, phone } = req.body
		const file = req.file as Express.Multer.File

		const centerExists = await prisma.center.findFirst({
			where: { name },
		})

		if (centerExists) {
			return res.status(409).json({
				message: "Ya existe un centro de atención con este nombre",
				type: "error",
				values: { conflicts: ["name"] },
			})
		}

		const formData = new FormData()
		formData.append("image", bufferToBlob(file.buffer, file.mimetype), file.originalname)

		const center = await prisma.center.create({
			data: {
				name,
				address,
				phone,
			},
		})

		return res.status(201).json({
			message: "Centro creado correctamente",
			type: "success",
			values: center,
		})
	} catch (error) {
		next(error)
	}
}

// !TODO: Implementar la actualización de la imagen del centro
// !TODO: Implementar validación de existencia de nombre de centro
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params
		const { name, address, phone } = req.body

		const updatedCenter = await prisma.center.update({
			where: { id: Number(id) },
			data: {
				name,
				address,
				phone,
			},
			select: {
				id: true,
				name: true,
				address: true,
				phone: true,
			},
		})

		return res.status(200).json({
			message: "Centro actualizado exitosamente",
			type: "success",
			values: updatedCenter,
		})
	} catch (error) {
		next(error)
	}
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id)

		const center = await prisma.center.findUnique({
			where: { id },
		})

		if (!center) throw new AppError(400, "El centro no existe")

		await prisma.event.updateMany({
			where: { centerId: id },
			data: { centerId: null },
		})

		await prisma.center.delete({ where: { id } })

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: { deletedId: id },
		})
	} catch (error) {
		next(error)
	}
}
