// Utilizar o nodemailer para enviar e-mails
// import nodemailer from "nodemailer"
// recomiendo crear una función que envíe el correo y tipar sus argumentos

import nodemailer from "nodemailer"

const { MAIL_USERNAME, OAUTH_CLIENTID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN } = process.env

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: MAIL_USERNAME,
		clientId: OAUTH_CLIENTID,
		clientSecret: OAUTH_CLIENT_SECRET,
		refreshToken: OAUTH_REFRESH_TOKEN,
	},
})

const sendMail = async (to: string, subject: string, text: string) => {
	const mailOptions = {
		from: MAIL_USERNAME,
		to,
		subject,
		text,
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
