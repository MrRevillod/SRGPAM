import { z } from "zod"

import * as rules from "./validationRules"

export const LoginFormSchema = z.object({
	email: z.string().email().min(1, "El correo electrónico es requerido"),
	password: z.string().min(1, "La contraseña es requerida"),
	role: z.enum(["ADMIN", "PROFESSIONAL"]),
})

export const SeniorSchemas = {
	MobileRegister: z.object({
		rut: rules.rutSchema,
		email: rules.emailSchema,
		pin: rules.pinSchema,
	}),

	DashboardRegister: z.object({
		id: rules.rutSchema,
		email: rules.emailSchema,
		name: rules.nameSchema,
		address: rules.addressSchema,
		birthDate: rules.birthDateSchema,
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			address: rules.addressSchema,
			birthDate: rules.birthDateSchema,
			password: rules.optionalPinSchema,
			confirmPassword: rules.optionalPinSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Los PIN ingresados no coinciden",
		}),

	Validate: z.object({
		rut: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
		address: rules.addressSchema,
		birthDate: rules.birthDateSchema,
	}),
}

export const AdministratorSchemas = {
	Create: z.object({
		id: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			password: rules.optionalPasswordSchema,
			confirmPassword: rules.optionalPasswordSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
		}),
}

export const ServiceSchemas = {
	Create: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		image: rules.imageSchemaCreate,
	}),
	Update: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		image: rules.imageSchemaUpdate,
	}),
}

export const CentersSchemas = {
	Create: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
		image: rules.imageSchemaCreate,
	}),
	Update: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
		image: rules.imageSchemaUpdate,
	}),
}

export const ProfessionalSchemas = AdministratorSchemas

const dateTimeSchema = z.number().refine(
	(value) => {
		const date = new Date(value)
		return !isNaN(date.getTime())
	},
	{
		message: "La fecha de ingresada no es válida",
	},
)

export const EventSchemas = {
	Create: z.object({
		startsAt: dateTimeSchema,
		endsAt: dateTimeSchema,
		professionalId: rules.rutSchema,
		serviceId: z.number(),
		seniorId: z.optional(rules.rutSchema),
		centerId: z.optional(z.string()),
	}),
	Update: z.object({
		startsAt: dateTimeSchema,
		endsAt: dateTimeSchema,
		professionalId: rules.rutSchema,
		serviceId: z.number(),
		assistance: z.optional(z.boolean()),
		seniorId: z.optional(rules.rutSchema),
		centerId: z.optional(z.string()),
	}),
}
