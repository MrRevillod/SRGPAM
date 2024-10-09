import { NextFunction, Request, Response } from "express"
import { AppError, AuthResponse, getServerTokens, httpRequest, UserRole } from "@repo/lib"

export const validateRole = (role: UserRole) => async (req: Request, res: Response, next: NextFunction) => {
	const tokens = getServerTokens(req.headers, req.cookies)

	try {
		const response = await httpRequest<AuthResponse>({
			service: "AUTH",
			endpoint: `/validate-role/${role}`,
			headers: {
				Authorization: `Bearer ${tokens?.access || null}`,
			},
		})

		if (response.type === "error") {
			throw new AppError(response.status || 500, response.message)
		}

		req.setExtension("tokens", tokens)
		req.setExtension("role", (response.values as any).role)
		req.setExtension("user", response.values.user)

		next()
	} catch (error) {
		next(error)
	}
}
