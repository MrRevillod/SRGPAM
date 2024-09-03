import { NextFunction, Request, RequestHandler, Response } from "express"

export const validateArray = (req: Request, res: Response, next: NextFunction) => {
	next()
}
