import { Router } from "express"
import { requestPasswordReset, resetPassword } from "../controllers/mailer"

const router: Router = Router()

router.post("/reset-password", requestPasswordReset)

router.post("/reset-password/:id/:token", resetPassword)

export default router
