import { log } from "."
import { JsonResponse } from "./types"
import { NextFunction, Request, Response } from "express"

export class AppError extends Error {
	public code: number
	public data: Record<string, unknown> | unknown[] | undefined

	constructor(code: number, message: string, data?: Record<string, unknown>) {
		super(message)
		this.code = code
		this.data = data
	}
}

export class AuthError extends AppError {
	constructor(code: number, message: string) {
		super(code, message)
	}
}

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
	log((err as Error).stack || "Uknown error from the error handler")

	if (!(err instanceof AppError)) {
		return res.status(500).json({ message: "Internal Server Error", type: "error" })
	}

	const jsonResponse: JsonResponse = {
		message: err.message,
		type: "error",
		values: err.data !== undefined ? err.data : null,
	}

	return res.status(err.code).json(jsonResponse)
}
