import { Router } from "express"
import { validateFields } from "./middlewares/validations"
import { loginController } from "./controllers/login"
import { sessionMiddleware } from "./middlewares/authentication"

const router: Router = Router()

router.post("/login", validateFields("LOGIN_FIELDS"), loginController)

router.post("/validate-auth", sessionMiddleware, (req, res) => {
	console.log(req.getExtension("userId"))
	return res.status(200)
})
router.post("/validate-role", (req, res) => {})
export default router
