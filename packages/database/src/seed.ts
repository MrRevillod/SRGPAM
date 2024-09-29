const { hash } = require("bcrypt")
const { PrismaClient } = require("@prisma/client")
const { faker } = require("@faker-js/faker")

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
	const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "admin123"
	const DEFAULT_PROFESSIONAL_PASSWORD = process.env.DEFAULT_PROFESSIONAL_PASSWORD || "pro123"
	const servicesName = [
		{ name: "Psicología", title: "Psicólogo(a)" },
		{ name: "Fisioterapia", title: "Fisioterapeuta" },
		{ name: "Nutrición", title: "Nutricionista" },
		{ name: "Cardiología", title: "Cardiólogo(a)" },
		{ name: "Odontología", title: "Odontólogo(a)" },
		{ name: "Dermatología", title: "Dermatólogo(a)" },
		{ name: "Ginecología", title: "Ginecólogo(a)" },
		{ name: "Pediatría", title: "Pediatra" },
		{ name: "Oftalmología", title: "Oftalmólogo(a)" },
		{ name: "Psiquiatría", title: "Psiquiatra" },
		{ name: "Traumatología", title: "Traumatólogo(a)" },
	]

	const centers = [
		{ name: "Centro Médico Norte", address: "Calle Norte 123" },
		{ name: "Centro de Salud Sur", address: "Avenida Sur 456" },
		{ name: "Clínica Este", address: "Avenida Este 789" },
		{ name: "Hospital Oeste", address: "Calle Oeste 101" },
		{ name: "Policlínico Central", address: "Plaza Central 202" },
		{ name: "Centro Médico Las Flores", address: "Calle Flores 303" },
		{ name: "Clínica del Valle", address: "Avenida Valle 404" },
		{ name: "Hospital San Juan", address: "Calle San Juan 505" },
		{ name: "Centro de Especialidades El Prado", address: "Paseo El Prado 606" },
		{ name: "Clínica Los Pinos", address: "Avenida Los Pinos 707" },
	]

	for (let i = 1; i <= 25; i++) {
		const rand = Math.floor(Math.random() * 1000)
		const randomService = servicesName[Math.floor(Math.random() * servicesName.length)]
		const randomCenter = centers[Math.floor(Math.random() * centers.length)]

		try {
			const AdminRUT = genRUT()
			const SeniorRUT = genRUT()
			const ProfessionalRUT = genRUT()

			const adminFirstName = faker.person.firstName()
			const adminLastName = faker.person.lastName()
			const professionalFirstName = faker.person.firstName()
			const professionalLastName = faker.person.lastName()
			const seniorFirstName = faker.person.firstName()
			const seniorLastName = faker.person.lastName()

			const adminEmail = `${adminFirstName[0].toLowerCase()}${adminLastName.toLowerCase()}@admins.com`
			const professionalEmail = `${professionalFirstName[0].toLowerCase()}${professionalLastName.toLowerCase()}@professionals.com`
			const seniorEmail = `${seniorFirstName[0].toLowerCase()}${seniorLastName.toLowerCase()}@seniors.com`

			const randomBirthDate = faker.date.between({ from: "1950-01-01", to: "2005-12-31" })
			const randomStartDate = faker.date.between({ from: "2022-01-01", to: "2022-12-31" })
			const randomEndDate = faker.date.between({ from: randomStartDate, to: "2023-12-31" })

			await prisma.administrator.upsert({
				where: { id: AdminRUT },
				create: {
					id: AdminRUT,
					email: adminEmail,
					password: await hash(DEFAULT_ADMIN_PASSWORD, 10),
					name: `${adminFirstName} ${adminLastName}`,
				},
				update: {},
			})

			await prisma.senior.upsert({
				where: { id: SeniorRUT },
				create: {
					id: SeniorRUT,
					email: seniorEmail,
					password: await hash(DEFAULT_SENIOR_PASSWORD, 10),
					name: `${seniorFirstName} ${seniorLastName}`,
					address: faker.location.streetAddress(),
					birthDate: randomBirthDate,
					validated: rand % 2 === 0,
				},
				update: {},
			})

			await prisma.service.upsert({
				where: { id: i },
				create: {
					id: i,
					name: randomService.name,
					title: randomService.title,
					description: faker.lorem.paragraph(),
				},
				update: {},
			})

			await prisma.center.upsert({
				where: { id: i },
				create: {
					id: i,
					name: randomCenter.name,
					address: randomCenter.address,
					phone: DEFAULT_PHONE,
				},
				update: {},
			})

			await prisma.professional.upsert({
				where: { id: ProfessionalRUT },
				create: {
					id: ProfessionalRUT,
					email: professionalEmail,
					password: await hash(DEFAULT_PROFESSIONAL_PASSWORD, 10),
					name: `${professionalFirstName} ${professionalLastName}`,
					serviceId: i,
				},
				update: {},
			})

			await prisma.event.upsert({
				where: { id: i },
				create: {
					id: i,
					startsAt: randomStartDate,
					endsAt: randomEndDate,
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
