import { prisma } from "@repo/database"
import { bufferToBlob } from "../utils/files"
import { Request, Response, NextFunction } from "express"
import { AppError, httpRequest } from "@repo/lib"

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

		if (!file) {
			throw new AppError(400, "No se a enviado un archivo")
		}

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

		const center = await prisma.center.create({
			data: {
				name,
				address,
				phone,
			},
		})

		const renameFile = file
		const extFile = file.originalname.split(".")[1]
		renameFile.originalname = `${center.id}.${extFile}`
		const formData = new FormData()

		formData.append("files", bufferToBlob(renameFile.buffer, renameFile.mimetype), renameFile.originalname)

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/upload?path=%2Fcenters`,
			method: "POST",
			variant: "MULTIPART",
			body: formData,
		})

		if (response.type == "error") {
			await prisma.center.delete({ where: { id: center.id } })
			throw new AppError(response.status ?? 500, response.message)
		}

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

		const center = await prisma.center.update({
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

		if (req.file) {
			const file = req.file
			const renameFile = file
			const extFile = file.originalname.split(".")[1]
			renameFile.originalname = `${center.id}.${extFile}`
			const formData = new FormData()

			formData.append("files", bufferToBlob(renameFile.buffer, renameFile.mimetype), renameFile.originalname)
			const response = await httpRequest<null>({
				service: "STORAGE",
				endpoint: `/upload?path=%2Fcenters`,
				method: "POST",
				variant: "MULTIPART",
				body: formData,
			})
			if (response.type == "error") {
				await prisma.center.delete({ where: { id: center.id } })
				throw new AppError(response.status ?? 500, response.message)
			}
		}

		return res.status(200).json({
			message: "Centro actualizado exitosamente",
			type: "success",
			values: center,
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

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/delete?path=%2Fcenters%2F${center.id}`,
			method: "DELETE",
			variant: "JSON",
			body: {},
		})
		console.log(response)
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
