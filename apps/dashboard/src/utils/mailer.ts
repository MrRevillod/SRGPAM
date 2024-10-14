import nodemailer from "nodemailer"
import { constants } from "@repo/lib"

const { PROJECT_EMAIL_ADDRESS, PROJECT_EMAIL_PASSWORD, PROJECT_EMAIL_HOST } = constants
const transporter = nodemailer.createTransport({
	service: PROJECT_EMAIL_HOST,
	auth: {
		user: PROJECT_EMAIL_ADDRESS,
		pass: PROJECT_EMAIL_PASSWORD,
	},
})

const sendMail = async (to: string, subject: string, html: string) => {
	const mailOptions = {
		from: PROJECT_EMAIL_ADDRESS,
		to,
		subject,
		html,
	}

	try {
		const info = await transporter.sendMail(mailOptions)
		console.log("✅ Email sent:", info.response)
	} catch (error) {
		if (error instanceof Error) {
			console.error("❌ Error:", error.message)
		} else {
			console.error("❌ Error:", error)
		}
		throw new Error("Error al enviar el correo")
	}
}

export default sendMail
