import { z } from "zod"
import { isValidRut } from "./authorization/rut"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const rutSchema = z.string().refine(isValidRut, {
	message: "El RUT ingresado no es válido",
})

const emailSchema = z.string().refine((value) => value === "" || emailRegex.test(value), {
	message: "El email ingresado no es válido",
})

const pinSchema = z.string().refine((value) => value.length === 4, {
	message: "El PIN debe tener 4 dígitos",
})

const optionalPinSchema = z.string().refine((value) => value === "" || value.length === 4, {
	message: "Debe ser una cadena vacía o de exactamente 4 dígitos",
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

const addressSchema = z.string().min(2, "La dirección debe tener al menos 2 caracteres")

const birthDateSchema = z.string().refine((value) => !isNaN(Date.parse(value)), {
	message: "La fecha de nacimiento ingresada no es válida",
})

export type SchemasKeys =
	| keyof typeof SeniorSchemas
	| keyof typeof AdministratorSchemas
	| keyof typeof ProfessionalSchemas

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

export const ProfessionalSchemas = AdministratorSchemas
