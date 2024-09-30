import { Router } from "express"
import { requestPasswordReset } from "../controllers/mailer"

const router: Router = Router()

router.post("/reset-password", requestPasswordReset)

// router.post("/reset-password/:token", resetPassword)

export default router
