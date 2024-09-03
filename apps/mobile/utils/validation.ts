import * as z from "zod"

export const registerSchema = z.object({
	rut: z.string().min(1, "RUT es requerido"),
	email: z.string().optional(),
	pin: z.string().min(1, "PIN es requerido"),
	pinConfirm: z.string().min(1, "Confirmación de PIN es requerida"),
})
