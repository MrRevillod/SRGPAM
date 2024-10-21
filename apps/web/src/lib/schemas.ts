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

	DashboardRegister: z
		.object({
			id: rules.rutSchema,
			email: rules.emailSchema,
			name: rules.nameSchema,
			address: rules.addressSchema,
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }),
		})
		.refine((data) => rules.isValidDate(data.birthDate), {
			message: "La fecha de ingresada no es válida",
			path: ["birthDate"],
		}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			address: rules.addressSchema,
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }),
			password: rules.optionalPinSchema,
			confirmPassword: rules.optionalPinSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Los PIN ingresados no coinciden",
			path: ["confirmPassword"],
		})
		.refine((data) => rules.isValidDate(data.birthDate), {
			message: "La fecha de ingresada no es válida",
			path: ["birthDate"],
		}),

	Validate: z
		.object({
			rut: z.string({ message: "El RUT es requerido" }),
			name: rules.nameSchema,
			email: rules.emailSchema,
			address: rules.addressSchema,
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }),
		})
		.refine((data) => rules.isValidDate(data.birthDate), {
			message: "La fecha de ingresada no es válida",
			path: ["birthDate"],
		})
		.refine((data) => rules.isValidRut(data.rut), {
			message: "El RUT ingresado no es válido",
			path: ["rut"],
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
			image: rules.imageSchemaUpdate,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
			path: ["confirmPassword"],
		}),
}

export const ProfessionalSchemas = {
	Create: z.object({
		id: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
		serviceId: z.number({ message: "La profesión es requerida" }),
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			password: rules.optionalPasswordSchema,
			confirmPassword: rules.optionalPasswordSchema,
			image: rules.imageSchemaUpdate,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
			path: ["confirmPassword"],
		}),
}

export const ServiceSchemas = {
	Create: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		image: rules.imageSchemaCreate,
		color: rules.colorSchema,
	}),
	Update: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		image: rules.imageSchemaUpdate,
		color: rules.colorSchema,
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

export const EventSchemas = {
	Create: z
		.object({
			startsAt: z.string({ message: "La fecha de inicio es requerida" }),
			endsAt: z.string({ message: "La fecha de término es requerida" }),
			professionalId: z.string({ message: "El profesional es requerido" }),
			serviceId: z.number({ message: "El servicio es requerido" }),
			seniorId: z.optional(rules.rutSchema),
			centerId: z.number({ message: "El centro es requerido" }),
		})
		.refine((data) => data.startsAt < data.endsAt, {
			path: ["endsAt", "startsAt"],
			message: "Rango de tiempo invalido",
		})
		.refine((data) => rules.isValidRut(data.professionalId), {
			message: "El campo no es válido",
			path: ["professionalId"],
		})
		.refine((data) => rules.isValidDate(data.startsAt), {
			message: "La fecha de ingresada no es válida",
			path: ["startsAt"],
		})
		.refine((data) => rules.isValidDate(data.endsAt), {
			message: "La fecha de ingresada no es válida",
			path: ["endsAt"],
		}),

	Update: z
		.object({
			startsAt: z.string({ message: "La fecha de inicio es requerida" }),
			endsAt: z.string({ message: "La fecha de término es requerida" }),
			professionalId: rules.rutSchema,
			serviceId: z.number(),
			assistance: z.boolean(),
			seniorId: z.optional(rules.rutSchema),
			centerId: z.number(),
		})
		.refine((data) => data.startsAt < data.endsAt, {
			path: ["endsAt", "startsAt"],
			message: "Rango de tiempo invalido",
		})
		.refine((data) => rules.isValidRut(data.professionalId), {
			message: "El campo no es válido",
			path: ["professionalId"],
		})
		.refine((data) => rules.isValidDate(data.startsAt), {
			message: "La fecha de ingresada no es válida",
			path: ["startsAt"],
		})
		.refine((data) => rules.isValidDate(data.endsAt), {
			message: "La fecha de ingresada no es válida",
			path: ["endsAt"],
		}),
}

export const resetPasswordSchema = (role: "ADMIN" | "PROFESSIONAL" | "SENIOR"): any => {
	return z
		.object({
			password: role === "SENIOR" ? rules.pinSchema : rules.passwordSchema,
			confirmPassword: role === "SENIOR" ? rules.pinSchema : rules.passwordSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
			path: ["confirmPassword"],
		})
}
