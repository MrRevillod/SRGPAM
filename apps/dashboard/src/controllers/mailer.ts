import nodemailer from "nodemailer"

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
})

// Email options
const sendMail = async (to: string, subject: string, text: string) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to,
		subject,
		text,
	}

	try {
		const info = await transporter.sendMail(mailOptions)
		console.log("✅ Email sent:", info.response)
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("❌ Error:", error.message)
		} else {
			console.error("❌ Error:", error)
		}
		throw error
	}
}

export default sendMail
