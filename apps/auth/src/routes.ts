import { Router } from "express"
import { validateFields } from "./middlewares/validations"
import { loginController, loginSeniorMobile } from "./controllers/login"
import { sessionMiddleware, authenticationByRole } from "./middlewares/authentication"

const router: Router = Router()

router.post("/login", validateFields("LOGIN_FIELDS"), loginController)
router.post("/login-senior", validateFields("SENIOR_LOGIN_FIELDS"), loginSeniorMobile)
router.post("/validate-auth", sessionMiddleware, (req, res) => {
	console.log(req.getExtension("userId"))
	return res.status(200).send()
})
router.post("/validate-role", sessionMiddleware, authenticationByRole("ADMIN"), (req, res) => {
	console.log(req.getExtension("role"))
	console.log(req.getExtension("user"))
	return res.status(200).send()
})
export default router
