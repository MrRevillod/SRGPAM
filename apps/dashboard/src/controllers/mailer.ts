import { Request, Response, NextFunction } from "express"
import sendMail from "../utils/mailer"
import { AppError, CustomTokenOpts, signJsonwebtoken, services, findUser } from "@repo/lib"

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
	const userRole = req.query.variant

	if (userRole !== "ADMIN" && userRole !== "PROFESSIONAL" && userRole !== "SENIOR") {
		throw new AppError(400, "Rol de usuario no valido")
	}

	try {
		const { email } = req.body

		if (!email) {
			throw new AppError(400, "Se requiere un correo electrónico")
		}

		const user = await findUser(email, userRole)

		if (!user) throw new AppError(404, "El usuario no existe.")

		const payload = { id: user.id, email: email }
		const tokenOpt = CustomTokenOpts(user.password, "30d")
		const token = signJsonwebtoken(payload, tokenOpt)

		const resetLink = `${services.WEB_APP.url}/reset-password/${token}`

		await sendMail(
			email,
			"Restablecimiento de contraseña",
			`Hola, ${user.name}. Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
		)

		return res.status(200).json({
			message: "Correo de restauración enviado correctamente",
			type: "success",
		})
	} catch (error) {
		next(error)
	}
}
