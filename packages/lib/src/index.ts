import { NextFunction, Request, Response } from "express"

export const log = (...args: unknown[]): void => {
	console.log("LOGGER: ", ...args)
}

declare global {
	namespace Express {
		interface Request {
			extensions: Map<string, unknown>
			setExtension: (key: string, value: unknown) => void
			getExtension: (key: string) => unknown | undefined
		}
	}
}

export const extensions = (req: Request, res: Response, next: NextFunction) => {
	req.extensions = new Map<string, unknown>()

	req.setExtension = (key: string, value: unknown) => {
		req.extensions.set(key, value)
	}

	req.getExtension = (key: string) => {
		return req.extensions.get(key)
	}

	next()
}

export { httpRequest } from "./request"
export { getServerCookies } from "./authorization/cookies"
export { services, constants } from "./config"
export type { JsonResponse, UserKind } from "./types"
export { AppError, AuthError, errorHandler } from "./errors"
export { toPublicUser } from "./authorization/user"
export { isValidRut } from "./authorization/rut"

export {
	signJsonwebtoken,
	verifyJsonwebtoken,
	AccessTokenOpts,
	CustomTokenOpts,
	RefreshTokenOpts,
} from "./authorization/jsonwebtoken"
