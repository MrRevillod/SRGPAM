import { z } from "zod"
import * as rules from "./validationRules"

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
			address: rules.addressSchema,
			birthDate: rules.birthDateSchema,
			password: rules.optionalPinSchema,
			confirmPassword: rules.optionalPinSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Los PIN ingresados no coinciden",
			path: ["confirmPassword"],
		}),
}

export const ServiceSchemas = {
	Create: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
	}),
	Update: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
	}),
}

export const CentersSchemas = {
	Create: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
	}),
	Update: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
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
			path: ["confirmPassword"],
		}),
}

export const EventSchemas = {
	Create: z.object({
		startsAt: rules.dateTimeSchema,
		endsAt: rules.dateTimeSchema,
		professionalId: rules.rutSchema,
		serviceId: z.number(),
		seniorId: z.optional(rules.rutSchema),
		centerId: z.optional(z.number()),
	}),
	Update: z.object({
		startsAt: rules.dateTimeSchema,
		endsAt: rules.dateTimeSchema,
		professionalId: rules.rutSchema,
		serviceId: z.number(),
		assistance: z.optional(z.boolean().nullable()),
		seniorId: z.optional(rules.rutSchema),
		centerId: z.optional(z.number().nullable()),
	}),
}

export const ProfessionalSchemas = AdministratorSchemas

