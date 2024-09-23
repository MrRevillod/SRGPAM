import { NextFunction, Request, Response } from "express"
import { AppError, getServerTokens, httpRequest, UserRole } from "@repo/lib"

export const validateRole = (role: UserRole) => async (req: Request, res: Response, next: NextFunction) => {
	const tokens = getServerTokens(req.headers, req.cookies)
	console.log("ROL TOKENS ---->", tokens)
	try {
		const response = await httpRequest({
			service: "AUTH",
			endpoint: `/validate-role/${role}`,
			headers: {
				Authorization: `Bearer ${tokens?.access || null}`,
			},
		})

		if (response.type === "error") {
			throw new AppError(response.status || 500, response.message)
		}

		next()
	} catch (error) {
		next(error)
	}
}
