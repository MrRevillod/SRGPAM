import { NextFunction, Request, Response } from "express"
import { AppError, findUser, isValidUserRole } from "@repo/lib"
import { verifyJsonwebtoken, AccessTokenOpts, getServerTokens } from "@repo/lib"

// Middleware que se encarga de verificar y validar una sesión
// de usuario mediante su token de acceso JWT
export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// // Obtener los tokens de la petición (cookies o headers)

		const accessCookie = req.cookies["ACCESS_TOKEN"]

		const authHeader = req.headers.authorization
		let accessHeaderToken = null
		if (authHeader && authHeader.startsWith("Bearer ")) {
			accessHeaderToken = authHeader.split("Bearer ")[1].split(",")[0].trim()
		}
		const accessToken = accessCookie || accessHeaderToken

		console.log("TOKEN FROM AUTH", accessToken)
		if (!accessToken) throw new AppError(401, "No tienes autorización para acceder a este recurso")

		const payload = verifyJsonwebtoken(accessToken, AccessTokenOpts)

		if (!payload.id || !payload.role) {
			throw new AppError(401, "No tienes autorización para acceder a este recurso")
		}

		// Se busca al usuario que está realizando la petición actual
		const user = await findUser({ id: payload.id }, payload.role)
		if (!user) throw new AppError(401, "No tienes autorización para acceder a este recurso")

		// Se añade la información del usuario a la petición

		req.setExtension("user", user)
		req.setExtension("role", payload.role)
		req.setExtension("userId", payload.id)

		next()
	} catch (error) {
		next(error)
	}
}

// Middleware que se encarga de verificar si el usuario que está
// realizando la petición tiene el rol necesario para acceder a un recurso específico
export const authenticationByRole = async (req: Request, res: Response, next: NextFunction) => {
	// Se obtiene el rol requerido para acceder al recurso
	// desde la URL de la petición "/validate-role/ADMIN
	const requiredRole = req.params.role

	try {
		if (!isValidUserRole(requiredRole)) {
			throw new AppError(401, "No tienes permisos para acceder a este recurso")
		}

		// Se obtiene el rol del usuario que está realizando la petición
		const currentUserRole = req.getExtension("role")

		if (currentUserRole !== requiredRole) {
			throw new AppError(401, "No tienes permisos para acceder a este recurso")
		}

		console.log("PASO MW DE ROLE")

		next()
	} catch (error) {
		next(error)
	}
}
