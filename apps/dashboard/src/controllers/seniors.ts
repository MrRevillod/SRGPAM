import { Request, Response, NextFunction } from "express"
import { hash } from "bcrypt"
import { prisma } from "@repo/database"
export const registerSeniorFromMobile = async (req: Request, res: Response, next: NextFunction) => {
	const { rut, pin, email } = req.body
	console.log(req.files)
	try {
		const hashedPin = await hash(pin, 10)
		await prisma.senior.create({
			data: {
				id: rut,
				password: hashedPin,
				email: email !== undefined ? email : "",
				address: "",
				birthDate: new Date(),
				name: "",
			},
		})
		return res.status(200).json(req.body)
	} catch (error: unknown) {
		next(error)
	}
}
