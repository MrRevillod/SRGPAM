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

	console.log("DEFAULT_ADMIN_PASSWORD:", DEFAULT_ADMIN_PASSWORD)
	console.log("DEFAULT_PROFESSIONAL_PASSWORD:", DEFAULT_PROFESSIONAL_PASSWORD)

	for (let i = 1; i <= 25; i++) {
		const rand = Math.floor(Math.random() * 1000)
		const randomService = servicesName[Math.floor(Math.random() * servicesName.length)] // Seleccionar servicio aleatoriamente
		const randomCenter = centers[Math.floor(Math.random() * centers.length)] // Seleccionar centro aleatoriamente

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
					name: randomService.name, // Asignar el nombre del servicio aleatorio
					title: randomService.title, // Asignar el título del servicio aleatorio
					description:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
				},
				update: {},
			})
			await prisma.center.upsert({
				where: { id: i },
				create: {
					id: i,
					name: randomCenter.name, // Asignar el nombre del centro aleatorio
					address: randomCenter.address, // Asignar la dirección del centro aleatorio
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
