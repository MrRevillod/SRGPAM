import { Router } from "express"
import { administratorsLogin, professionalsLogin } from "./controllers/login"
import { validateFields } from "./middlewares/validations"

const router: Router = Router()

router.post("/administrators/login", validateFields("LOGIN_FIELDS"), administratorsLogin)
router.post("/professionals/login", validateFields("LOGIN_FIELDS"), professionalsLogin)
router.post("/seniors/login", validateFields("SENIOR_LOGIN_FIELDS"), (req, res) => {})

router.post("/validate-auth", (req, res) => {})
router.post("/validate-role", (req, res) => {})

export default router
