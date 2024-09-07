import { z } from "zod"
import { match } from "ts-pattern"
import { NextFunction, Request, Response } from "express"

type ValidationRule = "ADMIN_LOGIN_FIELDS" | "SENIOR_LOGIN_FIELDS"

const AdminLoginFields = z.object({
	email: z.string(),
	password: z.string(),
})

const SeniorLoginFields = z.object({
	rut: z.string(),
	password: z.string(),
})

export const validateFields = (rule: ValidationRule) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const body = req.body

		try {
			match(rule)
				.with("ADMIN_LOGIN_FIELDS", () => AdminLoginFields.parse(body))
				.with("SENIOR_LOGIN_FIELDS", () => SeniorLoginFields.parse(body))
				.run()

			next()
		} catch (error: unknown) {
			next(error)
		}
	}
}
