import { match } from "ts-pattern"
import { AppError, findUser, UserRole } from "@repo/lib"
import { Request, Response, NextFunction } from "express"
import { SeniorSchemas, AdministratorSchemas, ProfessionalSchemas, SchemasKeys } from "@repo/lib"

// Middleware de validación de ID de usuario
// Valida si el ID de usuario en la URL de la petición es válido (existe en la base de datos)
export const validateUserId = (role: UserRole) => async (req: Request, res: Response, next: NextFunction) => {
	if (!req.params.id) throw new AppError(400, "Petición inválida")

	try {
		const user = await findUser({ id: req.params.id }, role)
		if (!user) throw new AppError(400, "El usuario solicitado no existe")

		req.setExtension("user", user)

		next()
	} catch (error) {
		next(error)
	}
}

// Middleware de validación de campos en formularios
// Valida si los campos en el cuerpo de la petición son válidos
// según el rol del usuario y el tipo de formulario (fichero lib/schemas.ts)
export const fieldsValidation = (role: UserRole, variant: SchemasKeys) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			match(role)
				.with("SENIOR", () => {
					SeniorSchemas[variant as keyof typeof SeniorSchemas].parse(req.body)
				})
				.with("ADMIN", () => {
					AdministratorSchemas[variant as keyof typeof AdministratorSchemas].parse(req.body)
				})
				.with("PROFESSIONAL", () => {
					ProfessionalSchemas[variant as keyof typeof ProfessionalSchemas].parse(req.body)
				})
				.run()

			next()
		} catch (error: any) {
			next(new AppError(400, "Error de validación de campos en el formulario"))
		}
	}
}
