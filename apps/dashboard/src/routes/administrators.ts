import { Router } from "express"
import { getAdministrators, getAdministratorById, createAdministrator } from "../controllers/administrators"
const router: Router = Router()

router.get("/", getAdministrators)
router.get("/:id", getAdministratorById)
router.post("/", createAdministrator)
router.patch("/:id", async (req, res, next) => {})
router.delete("/:id", async (req, res, next) => {})

export default router
