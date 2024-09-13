import { Router } from "express"
import { validateFields } from "./middlewares/validations"
import { loginController } from "./controllers/login"

const router: Router = Router()

router.post("/login", validateFields("ADMIN_LOGIN_FIELDS"), loginController)

router.post("/validate-auth", (req, res) => {})
router.post("/validate-role", (req, res) => {})

export default router
