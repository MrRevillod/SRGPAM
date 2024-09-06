import { Router } from "express"
import { administratorsLogin } from "./controllers/login"

const router: Router = Router()

router.post("/administrators/login", administratorsLogin)
router.post("/professionals/login", (req, res) => {})
router.post("/seniors/login", (req, res) => {})

router.post("/validate-auth", (req, res) => {})
router.post("/validate-role", (req, res) => {})

export default router
