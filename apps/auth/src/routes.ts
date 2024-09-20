import { Router } from "express"
import { validateFields } from "./middlewares/validations"
import { logoutController } from "./controllers/logout"
import { authenticationByRole, sessionMiddleware } from "./middlewares/authentication"
import { refreshController, validateSession } from "./controllers/validate"
import { loginController, loginSeniorMobile } from "./controllers/login"

const router: Router = Router()

router.post("/login", validateFields("LOGIN_FIELDS"), loginController)
router.post("/login-senior", validateFields("SENIOR_LOGIN_FIELDS"), loginSeniorMobile)

router.get("/validate-auth", sessionMiddleware, validateSession)
router.post("/validate-role", authenticationByRole("ADMIN"), validateSession)
router.get("/refresh", refreshController)
router.post("/logout", sessionMiddleware, logoutController)

export default router

