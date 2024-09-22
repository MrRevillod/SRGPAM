import { Request, Response, NextFunction } from "express"

// Controlador para cerrar la sesión
// Valido para la aplicación web

export const logoutController = (req: Request, res: Response, next: NextFunction) => {
	// Se limpian las cookies de la respuesta mediante el metodo clearCookie

	res.clearCookie("ACCESS_TOKEN")
	res.clearCookie("REFRESH_TOKEN")

	return res.status(200).json({
		type: "success",
		message: "Sesión cerrada correctamente",
		status: 200,
		values: null,
	})
}
