import { z } from "zod"
import { UploadFile } from "antd"

import * as rules from "./validationRules"

export const LoginFormSchema = z.object({
	email: z.string().email().min(1, "El correo electrónico es requerido"),
	password: z.string().min(1, "La contraseña es requerida"),
	role: z.enum(["ADMIN", "PROFESSIONAL"]),
})

const ALLOWED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const imageSchemaCreate = z
	.any()
	.refine((file) => !!file, {
		message: "La imagen es obligatoria",
	})
	.refine((file) => ALLOWED_IMAGE_FORMATS.includes(file?.type), {
		message: "Formato de imagen no válido. Debe ser .jpg, .jpeg, .png o .webp",
	})
	.refine((file) => file?.size <= MAX_IMAGE_SIZE, {
		message: "El tamaño máximo de la imagen es de 5 MB",
	})

const imageSchemaUpdate = z
	.any()
	.refine((file) => !file || ALLOWED_IMAGE_FORMATS.includes(file?.type || ""), {
		message: "Formato de imagen no válido. Debe ser .jpg, .jpeg, .png o .webp",
	})
	.refine((file) => !file || (file?.size || 0) <= MAX_IMAGE_SIZE, {
		message: "El tamaño máximo de la imagen es de 5 MB",
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
			path: ["confirmPassword"],
		}),

	Validate: z
		.object({
			rut: rules.rutSchema,
			name: rules.nameSchema,
			email: rules.emailSchema,
			address: rules.addressSchema,
			birthDate: rules.birthDateSchema,
		})
		
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
      image: imageSchemaUpdate,
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
		path: ["startsAt", "endsAt"],
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
