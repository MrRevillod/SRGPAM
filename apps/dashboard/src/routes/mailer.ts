import { Router } from "express"
import { requestPasswordReset, resetPassword } from "../controllers/account"

const router: Router = Router()

router.post("/reset-password", requestPasswordReset)

router.post("/reset-password/:id/:token/:role", resetPassword)

export default router
