import * as z from "zod"

const registerSchema = z.object({
	rut: z.string().min(1, "RUT es requerido"),
	pin: z.string().min(1, "PIN es requerido"),
	pinConfirm: z.string().min(1, "Confirmación de PIN es requerida"),
})

export default registerSchema
