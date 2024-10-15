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

const optionalPasswordSchema = z
	.string()
	.refine(
		(value) =>
			value === "" ||
			(value.length >= 8 &&
				/[A-Z]/.test(value) &&
				/[a-z]/.test(value) &&
				/[0-9]/.test(value) &&
				/[\W_]/.test(value)),
		{
			message:
				"La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial, o ser vacía",
		},
	)

const nameSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(50, "El nombre no debe tener más de 50 caracteres")
	.regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "El nombre solo puede contener letras y espacios")

const addressSchema = z.string().min(2, "La dirección debe tener al menos 2 caracteres")

const birthDateSchema = z.string().refine((value) => !isNaN(Date.parse(value)), {
	message: "La fecha de nacimiento ingresada no es válida",
})

const dateTimeSchema = z.number().refine((value) => {
    const date = new Date(value);
    return !isNaN(date.getTime())
}, {
	message: "La fecha de ingr  esada no es válida",
})

export type SchemasKeys =
	| keyof typeof SeniorSchemas
	| keyof typeof AdministratorSchemas
	| keyof typeof ProfessionalSchemas

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

const descriptionSchema = z
	.string()
	.min(5, "La descripcion debe tener al menos 5 caracteres")
	.max(100, "La descripcion no debe tener mas de 100 palabras")
const addressCenterSchema = z.string().min(2, "La dirección debe tener al menos 2 caracteres")

const phoneSchema = z
	.string()
	.regex(/^[0-9]+$/, "El teléfono solo puede contener números")
	.min(8, "El número de teléfono debe tener al menos 8 dígitos")
	.max(15, "El número de teléfono no debe tener más de 15 dígitos")

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

export const ServiceSchemas = {
	Create: z.object({
		name: nameServiceSchema,
		title: titleServiceSchema,
		description: descriptionSchema,
	}),
	Update: z.object({
		name: nameServiceSchema,
		title: titleServiceSchema,
		description: descriptionSchema,
	}),
}

export const CentersSchemas = {
	Create: z.object({
		name: nameCenterSchema,
		address: addressCenterSchema,
		phone: phoneSchema,
	}),
	Update: z.object({
		name: nameCenterSchema,
		address: addressCenterSchema,
		phone: phoneSchema,
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
			password: optionalPasswordSchema,
			confirmPassword: optionalPasswordSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
		}),
}

export const EventSchemas = {
	Create: z.object({
		startsAt: dateTimeSchema,
		endsAt: dateTimeSchema,
		professionalId: rutSchema,
		serviceId: z.number(),
		seniorId: z.optional(rutSchema),
		centerId: z.optional(z.number()),
	}),
	Update: z.object({
		startsAt: dateTimeSchema,
		endsAt: dateTimeSchema,
		professionalId: rutSchema,
		serviceId: z.number(),
		assistance: z.optional(z.boolean().nullable()),
		seniorId: z.optional(rutSchema),
		centerId: z.optional(z.number().nullable()),
	}).refine((data) => data.startsAt < data.endsAt, {
        message: "Rango de tiempo invalido",
    }),
}


export const ProfessionalSchemas = AdministratorSchemas
