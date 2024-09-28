const { hash } = require("bcrypt")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const genRUT = (): string => {
	const numero: string = Math.floor(Math.random() * 100000000)
		.toString()
		.padStart(7, "0")

	const calcularDV = (rut: string): string => {
		let suma: number = 0
		let multiplicador: number = 2

		for (let i = rut.length - 1; i >= 0; i--) {
			suma += multiplicador * parseInt(rut[i])
			multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
		}

		const resto: number = 11 - (suma % 11)
		if (resto === 11) return "0"
		if (resto === 10) return "K"
		return resto.toString()
	}

	const dv: string = calcularDV(numero)
	return `${numero}${dv}`
}

const seed = async () => {
	const DEFAULT_SENIOR_PASSWORD = "1234"
	const DEFAULT_PHONE = "123456789"
	const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD
	const DEFAULT_PROFESSIONAL_PASSWORD = process.env.DEFAULT_PROFESSINAL_PASSWORD

	console.log("DEFAULT_ADMIN_PASSWORD:", DEFAULT_ADMIN_PASSWORD)
	console.log("DEFAULT_PROFESSIONAL_PASSWORD:", DEFAULT_PROFESSIONAL_PASSWORD)

	for (let i = 1; i <= 25; i++) {
		const rand = Math.floor(Math.random() * 1000)

		try {
			const AdminRUT = genRUT()
			const SeniorRUT = genRUT()
			const ProfessionalRUT = genRUT()

			await prisma.administrator.upsert({
				where: { id: AdminRUT },
				create: {
					id: AdminRUT,
					email: `admin${i}@admins.com`,
					password: await hash(DEFAULT_ADMIN_PASSWORD, 10),
					name: `Admin N${i}`,
				},
				update: {},
			})
			await prisma.senior.upsert({
				where: { id: SeniorRUT },
				create: {
					id: SeniorRUT,
					email: `senior${i}@seniors.com`,
					password: await hash(DEFAULT_SENIOR_PASSWORD, 10),
					name: `Senior N${i}`,
					address: `Address N${i}`,
					birthDate: new Date("1990-01-01"),
					validated: rand % 2 === 0,
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
				where: { id: ProfessionalRUT },
				create: {
					id: ProfessionalRUT,
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
					seniorId: SeniorRUT,
					professionalId: ProfessionalRUT,
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
