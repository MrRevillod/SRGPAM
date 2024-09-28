import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"
import { bufferToBlob } from "../utils/files"

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
				message: "El centro con ese nombre ya existe",
				type: "error",
				values: { conflicts: ["name"] },
			})
		}

		const formData = new FormData()
		const image = bufferToBlob(file.buffer, file.mimetype)
		formData.append("image", image, file.originalname)
		console.log(formData)
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
			values: { center },
		})
	} catch (error) {
		next(error)
	}
}

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
			values: { updatedCenter },
		})
	} catch (error) {
		next(error)
	}
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id)

		await prisma.event.updateMany({
			where: { centerId: id },
			data: { centerId: null },
		})
		await prisma.center.delete({ where: { id } })

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: null,
		})
	} catch (error) {
		next(error)
	}
}
