import { prisma } from "@repo/database"
import { AppError, findUser, UserRole } from "@repo/lib"
import { Request, Response, NextFunction } from "express"
import { SomeZodObject, ZodEffects, ZodObject } from "zod"

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
export const validateSchema = (schema: SomeZodObject | ZodEffects<ZodObject<any, any>>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			console.table(req.body)

			schema.parse(req.body)
			next()
		} catch (error: any) {
			console.error(error.message)
			next(new AppError(400, "Error de validación de campos en el formulario"))
		}
	}
}

// Notas @aliwenn: Segun lo que entendi, decidi dividir en dos el middleware, uno para checkear eventos y el otro para checkear usuarios
// en primera instancia, si la id no existe, se lanza un error de peticion invalida
// luego, busco la id del usuario con el rol ADMIN con la funcion del @lib, si existe, dejo el admin pasar
// si esa validacion no se toma en cuenta entonces busco en EVENTOS si la id proporcionada le pertenece a un PROFESIONAL o SENIOR
// a mi criterio no es necesario validar que tipo de usuario es, ya que solo se me solicita validar pertenencia del evento a un usuario
// por ende si el usuario esta en el evento, esto quiere decir que le pertenece y por consecuencia puede pasar al siguiente middleware o controller
// segun el endpoint en el que se encuentre el middleware

// Problemas que se me vienen a la mente:
// - Que ocurre si la id del Profesional esta relacionada con multiples eventos? si yo solo estoy recibiendo la id del usuario, como se que evento le pertenece?
// - Si el usuario no tiene eventos relacionados, como se procede? se lanza un error? se le permite pasar?

export const eventOwner = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.params.id) throw new AppError(400, "Petición inválida")
	try {
		if (await findUser({ id: req.params.id }, "ADMIN")) next()
	} catch (error) {
		next(error)
	}
}

// Para el caso de los usuarios, se procede de la misma manera que con los eventos, se valida si la id existe, si el usuario es ADMIN y
// si no se procede a buscar en la base de datos,

export const userOwner = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.params.id) throw new AppError(400, "Petición inválida")
	try {
		if (await findUser({ id: req.params.id }, "ADMIN")) next()
	} catch (error) {
		next(error)
	}
}
