const { hash } = require("bcrypt")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const seed = async () => {
	const DEFAULT_SENIOR_PASSWORD = "1234"
	const DEFAULT_PHONE = "123456789"
	const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD
	const DEFAULT_PROFESSIONAL_PASSWORD = process.env.DEFAULT_PROFESSINAL_PASSWORD

	console.log("DEFAULT_ADMIN_PASSWORD:", DEFAULT_ADMIN_PASSWORD)
	console.log("DEFAULT_PROFESSIONAL_PASSWORD:", DEFAULT_PROFESSIONAL_PASSWORD)

	for (let i = 1; i <= 5; i++) {
		try {
			await prisma.administrator.upsert({
				where: { id: `Admin-${i}` },
				create: {
					id: `Admin-${i}`,
					email: `admin${i}@admins.com`,
					password: await hash(DEFAULT_ADMIN_PASSWORD, 10),
					name: `Admin N${i}`,
				},
				update: {},
			})
			await prisma.senior.upsert({
				where: { id: `Senior-${i}` },
				create: {
					id: `Senior-${i}`,
					email: `senior${i}@seniors.com`,
					password: await hash(DEFAULT_SENIOR_PASSWORD, 10),
					name: `Senior N${i}`,
					address: `Address N${i}`,
					birthDate: new Date("1990-01-01"),
					validated: true,
				},
				update: {},
			})
			await prisma.service.upsert({
				where: { id: i },
				create: {
					id: i,
					name: `Service N${i}`,
					title: `Service Title N${i}`,
				},
				update: {},
			})
			await prisma.center.upsert({
				where: { id: i },
				create: {
					id: i,
					name: `Center N${i}`,
					address: `Address N${i}`,
					phone: DEFAULT_PHONE,
				},
				update: {},
			})
			await prisma.professional.upsert({
				where: { id: `Professional-${i}` },
				create: {
					id: `Professional-${i}`,
					email: `pro${i}@professionals.com`,
					password: await hash(DEFAULT_PROFESSIONAL_PASSWORD, 10),
					name: `Professional N${i}`,
					serviceId: i,
				},
				update: {},
			})

			await prisma.event.upsert({
				where: { id: i },
				create: {
					id: i,
					startsAt: new Date("1990-01-01"),
					endsAt: new Date("1990-01-01"),
					assistance: true,
					seniorId: `Senior-${i}`,
					professionalId: `Professional-${i}`,
					serviceId: i,
					centerId: i,
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
