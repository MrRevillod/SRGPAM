import { Router } from "express"
import { validateFields } from "./middlewares/validations"
import { loginController, loginSeniorMobile } from "./controllers/login"
import { sessionMiddleware } from "./middlewares/authentication"
import { JsonResponse } from "@repo/lib"

const router: Router = Router()

router.post("/login", validateFields("LOGIN_FIELDS"), loginController)
router.post("/login-senior", validateFields("SENIOR_LOGIN_FIELDS"), loginSeniorMobile)
router.get("/validate-auth", sessionMiddleware, (req, res) => {
	const user = req.getExtension("user")

	const response: JsonResponse<any> = {
		type: "success",
		values: { user },
		message: "Usuario autenticado",
		status: 200,
	}

	return res.status(200).json(response)
})
router.post("/validate-role", (req, res) => {})
export default router
