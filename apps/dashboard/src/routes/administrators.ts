import { Router } from "express"
import { adminValidation, userIdValidation } from "../middlewares/validation"
import { getAdministrators, getAdministratorById, createAdministrator, updateAdministrator, deleteAdministrator } from "../controllers/administrators"

const router: Router = Router()

router.get("/", getAdministrators)
router.get("/:id", userIdValidation, getAdministratorById)
router.post("/",adminValidation, createAdministrator)
router.patch("/:id", userIdValidation, updateAdministrator)
router.delete("/:id", userIdValidation, deleteAdministrator)

export default router
