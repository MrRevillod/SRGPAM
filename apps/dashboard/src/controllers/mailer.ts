import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"
import sendMail from "../utils/mailer"
import { AppError, CustomTokenOpts, signJsonwebtoken, services, findUser, verifyJsonwebtoken } from "@repo/lib"
import { match } from "ts-pattern"

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
	const userRole = req.query.variant

	if (userRole !== "ADMIN" && userRole !== "PROFESSIONAL" && userRole !== "SENIOR") {
		throw new AppError(400, "Rol de usuario no válido")
	}

	try {
		const { email } = req.body

		if (!email) {
			throw new AppError(400, "Se requiere un correo electrónico")
		}

		const user = await findUser({ email }, userRole)

		if (!user) throw new AppError(404, "El usuario no existe.")

		const payload = { id: user.id, email: email }
		const tokenOpt = CustomTokenOpts(user.password, "30d")
		const token = signJsonwebtoken(payload, tokenOpt)

		const resetLink = `${services.WEB_APP.url}auth/reset-password/${user.id}/${token}`

		const htmlTemplate = `
			<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
				<h2 style="color: #4CAF50; text-align: center;">Restablecer contraseña</h2>
				<p>Hola, <strong>${user.name}</strong>.</p>
				<p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el enlace a continuación para continuar con el proceso de restablecimiento:</p>
				<p style="text-align: center;">
					<a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
					Restablecer contraseña
					</a>
				</p>
				<p>Este enlace expirará en 30 días. Si no solicitaste este cambio, simplemente ignora este correo.</p>
				<hr style="margin-top: 40px; border-color: #ddd;">
				<p style="text-align: center; color: #888;">© 2024 SRGPAM. Todos los derechos reservados.</p>
			</div>
		`

		await sendMail(email, "Restablecimiento de contraseña", htmlTemplate)

		return res.status(200).json({
			message: "Correo de restauración enviado correctamente",
			type: "success",
		})
	} catch (error) {
		next(error)
	}
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, token } = req.params
		const { password, userRole } = req.body

		const user = await findUser({ id }, userRole)

		if (!user) {
			return res.status(404).json({
				message: "Usuario no encontrado",
				type: "error",
			})
		}

		verifyJsonwebtoken(token, CustomTokenOpts(user?.password || "", "30d"))

		const hashedPassword = await hash(password, 10)

		let updatedUser
		const updated = await match(userRole)
			.with("SENIOR", async () => {
				updatedUser = await prisma.senior.update({
					where: { id: id },
					data: { password: hashedPassword },
				})
			})
			.with("ADMIN", async () => {
				updatedUser = await prisma.administrator.update({
					where: { id: id },
					data: { password: hashedPassword },
				})
			})
			.with("PROFESSIONAL", async () => {
				updatedUser = await prisma.professional.update({
					where: { id: id },
					data: { password: hashedPassword },
				})
			})
			.run()

		if (!updatedUser) {
			return res.status(500).json({
				message: "Error actualizando la contraseña",
				type: "error",
			})
		}

		return res.status(200).json({
			message: "Contraseña actualizada correctamente",
			type: "success",
		})
	} catch (error) {
		next(error)
	}
}
