import { Request, Response } from "express"
import sendMail from "../controllers/mailer"
import { Router } from "express"

const router: Router = Router()

router.post("/send-email", async (req: Request, res: Response) => {
	const { to, subject, message } = req.body

	try {
		await sendMail(to, subject, message)
		res.status(200).send("✅ Correo enviado exitosamente")
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("❌ Error al enviar el correo:", error.message)
		} else {
			console.error("❌ Error al enviar el correo:", error)
		}
		res.status(500).send("❌ Error al enviar el correo")
	}
})

export default router
