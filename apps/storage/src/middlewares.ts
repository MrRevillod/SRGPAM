import { AppError, constants } from "@repo/lib"
import { log } from "console"
import { NextFunction, Request, RequestHandler, Response } from "express"

export const validateArray: RequestHandler = (req, res, next) => {
	next()
}

export const validateCors = (req: Request, res: Response, next: NextFunction) => {
    log(req.headers)
    if (req.headers["x-storage-key"] !== constants.STORAGE_KEY) {
        next(new AppError(403,"No tiene permisos para acceder al servicio"))
    }
    next()
}
            