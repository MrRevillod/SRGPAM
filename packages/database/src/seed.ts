const { hash } = require("bcrypt")
const { PrismaClient } = require("@prisma/client")

require("dotenv").config({ path: "../../../.env" })

const prisma = new PrismaClient()

const DEFAULT_SENIOR_PASSWORD = "1234"
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD ?? "admin"
const DEFAULT_PROFESSIONAL_PASSWORD = process.env.DEFAULT_PROFESSIONAL_PASSWORD ?? "professional"

const seed = async () => {
	const adminHashedPassword = await hash(DEFAULT_ADMIN_PASSWORD, 10)
	const professionalHashedPassword = await hash(DEFAULT_PROFESSIONAL_PASSWORD, 10)
	const seniorHashedPassword = await hash(DEFAULT_SENIOR_PASSWORD, 10)

	for (let i = 1; i <= 5; i++) {
		try {
			await Promise.all([
				prisma.administrator.upsert({
					where: { id: `Admin-${i}` },
					create: {
						id: `Admin-${i}`,
						email: `admin${i}@admins.com`,
						password: adminHashedPassword,
						name: `Admin N${i}`,
					},
					update: {},
				}),

				prisma.senior.upsert({
					where: { id: `Senior-${i}` },
					create: {
						id: `Senior-${i}`,
						email: `senior${i}@seniors.com`,
						password: seniorHashedPassword,
						name: `Senior N${i}`,
						address: `Address N${i}`,
						birthDate: new Date("1990-01-01"),
						validated: true,
					},
					update: {},
				}),

				prisma.service.upsert({
					where: { id: i },
					create: {
						id: i,
						name: `Service N${i}`,
						title: `Service Title N${i}`,
					},
					update: {},
				}),
			])

			await prisma.professional.upsert({
				where: { id: `Professional-${i}` },
				create: {
					id: `Professional-${i}`,
					email: `pro${i}@professionals.com`,
					name: `Professional N${i}`,
					serviceId: i,
					password: professionalHashedPassword,
				},
				update: {},
			})
		} catch (error) {
			console.error(`Error en la iteración ${i}:`, error)
		}
	}
}

seed()
	.then(() => console.log("Seeding done!"))
	.catch((error) => console.error("Error en la función seed:", error))
