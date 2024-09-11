import { z } from "zod"

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

export const registerSchema = z
	.object({
		rut: z.string().refine(isValidRut, {
			message: "El RUT ingresado no es válido",
		}),
		email: z.string().email({ message: "Invalid email address" }).optional(),
		pin: z.number().refine((value) => value.toString.length === 4, {
			message: "El PIN debe tener 4 dígitos",
		})
	})


export const adminSchema = z.object({
	id: z.string().refine(isValidRut, {
		message: "El RUT ingresado no es válido",
	}),

	email: z.string().email({ message: "Invalid email address" }).optional(),
	password: z
		.string()
		.min(8, "La contraseña debe tener al menos 8 caracteres")
		.regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
		.regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
		.regex(/[0-9]/, "La contraseña debe contener al menos un número")
        .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
    name:z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no debe tener más de 50 caracteres")
    .regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "El nombre solo puede contener letras y espacios"),
})
