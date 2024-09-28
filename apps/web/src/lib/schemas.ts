import { z } from "zod"

export const LoginFormSchema = z.object({
	email: z.string().email().min(1, "El correo electrónico es requerido"),
	password: z.string().min(1, "La contraseña es requerida"),
	role: z.enum(["ADMIN", "PROFESSIONAL"]),
})

const isValidRutFormat = (rut: string): boolean => {
	const rutRegex = /^[0-9]+[0-9Kk]$/
	return rutRegex.test(rut)
}

export const isValidRut = (rut: string): boolean => {
	if (!isValidRutFormat(rut)) {
		return false
	}

	const body = rut.slice(0, -1)
	const verifier = rut.slice(-1).toUpperCase()

	let sum = 0
	let multiplier = 2

	for (let i = body.length - 1; i >= 0; i--) {
		sum += parseInt(body[i], 10) * multiplier
		multiplier = multiplier === 7 ? 2 : multiplier + 1
	}

	const mod11 = 11 - (sum % 11)
	const expectedVerifier = mod11 === 11 ? "0" : mod11 === 10 ? "K" : mod11.toString()

	return verifier === expectedVerifier
}

const rutSchema = z.string().refine(isValidRut, {
	message: "El RUT ingresado no es válido",
})

const emailSchema = z.string().email("El correo electrónico ingresado no es válido")

const pinSchema = z.string().refine((value) => value.length === 4, {
	message: "El PIN debe tener 4 dígitos",
})

const optionalPinSchema = z.string().refine((value) => value === "" || /^[0-9]{4}$/.test(value), {
	message: "El pin debe contener 4 dígitos numéricos",
})

const passwordSchema = z
	.string()
	.min(8, "La contraseña debe tener al menos 8 caracteres")
	.regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
	.regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
	.regex(/[0-9]/, "La contraseña debe contener al menos un número")
	.regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial")

const nameSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(50, "El nombre no debe tener más de 50 caracteres")
	.regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "El nombre solo puede contener letras y espacios")

const descriptionSchema = z
	.string()
	.min(5, "La descripcion debe tener al menos 5 caracteres")
	.max(100, "La descripcion no debe tener mas de 100 palabras")
const addressSchema = z.string().min(4, "La dirección debe tener al menos 4 caracteres")

const birthDateSchema = z.coerce.date({
	message: "La fecha de nacimiento ingresada no es válida",
})

export const SeniorSchemas = {
	MobileRegister: z.object({
		rut: rutSchema,
		email: emailSchema,
		pin: pinSchema,
	}),

	DashboardRegister: z.object({
		id: rutSchema,
		email: emailSchema,
		name: nameSchema,
		address: addressSchema,
		birthDate: birthDateSchema,
	}),

	Update: z
		.object({
			name: nameSchema,
			email: emailSchema,
			address: addressSchema,
			birthDate: birthDateSchema,
			password: optionalPinSchema,
			confirmPassword: optionalPinSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Los PIN ingresados no coinciden",
		}),
}

export const AdministratorSchemas = {
	Create: z.object({
		id: rutSchema,
		name: nameSchema,
		email: emailSchema,
	}),

	Update: z
		.object({
			name: nameSchema,
			email: emailSchema,
			password: passwordSchema,
			confirmPassword: passwordSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
		}),
}

const nameServiceSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(50, "El nombre no debe tener más de 50 caracteres")
	.regex(
		/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ\-'.()]+$/,
		"El nombre solo puede contener letras, espacios y caracteres especiales como - ' . ()",
	)

const titleServiceSchema = z
	.string()
	.min(2, "El título debe tener al menos 2 caracteres")
	.max(50, "El título no debe tener más de 50 caracteres")
	.regex(
		/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ\-'.()]+$/,
		"El título solo puede contener letras, espacios y caracteres especiales como - ' . ()",
	)

const nameCenterSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(50, "El nombre no debe tener más de 50 caracteres")
	.regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "El nombre solo puede contener letras y espacios")

const addressCenterSchema = z.string().min(2, "La dirección debe tener al menos 2 caracteres")

const phoneSchema = z
	.string()
	.regex(/^[0-9]+$/, "El teléfono solo puede contener números")
	.min(8, "El número de teléfono debe tener al menos 8 dígitos")
	.max(15, "El número de teléfono no debe tener más de 15 dígitos")

const imageSchemaCreate = z
	.any()
	.refine((files) => files?.length === 1, "La imagen es obligatoria")
	.refine((files) => files?.[0]?.size <= 5 * 1048576, "La imagen debe ser menor a 5MB")
	.refine(
		(files) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(files?.[0]?.type),
		"Formato de imagen no permitido. Solo se permiten JPEG, PNG, JPG y WEBP",
	)
const imageSchemaUpdate = z
	.any()
	.optional() // El campo `image` es opcional
	.refine((files) => !files || files?.length === 1, "Solo puedes subir una imagen")
	.refine((files) => !files || files?.[0]?.size <= 5 * 1048576, "La imagen debe ser menor a 5MB")
	.refine(
		(files) => !files || ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(files?.[0]?.type),
		"Formato de imagen no permitido. Solo se permiten JPEG, PNG, JPG y WEBP",
	)
export const ServiceSchemas = {
	Create: z.object({
		name: nameServiceSchema,
		title: titleServiceSchema,
		description: descriptionSchema,
		image: imageSchemaCreate,
	}),
	Update: z.object({
		name: nameServiceSchema,
		title: titleServiceSchema,
		description: descriptionSchema,
		image: imageSchemaUpdate,
	}),
}

export const CentersSchemas = {
	Create: z.object({
		name: nameCenterSchema,
		address: addressCenterSchema,
		phone: phoneSchema,
		image: imageSchemaCreate,
	}),
	Update: z.object({
		name: nameCenterSchema,
		address: addressCenterSchema,
		phone: phoneSchema,
		image: imageSchemaUpdate,
	}),
}
export const ProfessionalSchemas = AdministratorSchemas
