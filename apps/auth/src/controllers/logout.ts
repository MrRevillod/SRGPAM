import { Request, Response, NextFunction } from "express"

export const logoutController = (req: Request, res: Response, next: NextFunction) => {
	res.clearCookie("ACCESS_TOKEN")
	res.clearCookie("REFRESH_TOKEN")

	return res.status(200).json({
		type: "success",
		message: "Sesión cerrada correctamente",
		status: 200,
		values: null,
	})
}
