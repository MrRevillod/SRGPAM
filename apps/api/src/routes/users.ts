import { Router } from "express"
import { prisma } from "@repo/database"
import { JsonResponse, AppError } from "@repo/lib"

const router: Router = Router()

router.get("/", async (req, res, next) => {
	const rand = Math.random()

	try {
		if (rand < 0.5) {
			throw new AppError(401, "You are not authorized to access this resource", {
				reason: "You are not authorized to access this resource",
				rand: rand,
			})
		}

		const users = await prisma.user.findMany()
		const jsonResponse: JsonResponse = {
			message: "Users found",
			type: "success",
			values: users,
		}

		return res.status(200).json(jsonResponse)
	} catch (error: unknown) {
		next(error)
	}
})

export default router
