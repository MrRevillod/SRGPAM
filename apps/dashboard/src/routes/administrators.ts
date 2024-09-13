import { Router } from "express"
import { adminValidation, userIdValidation } from "../middlewares/validation"
import { getAdministrators, getAdministratorById, createAdministrator, updateAdministrator, deleteAdministrator } from "../controllers/administrators"

const router: Router = Router()

router.get("/", getAdministrators)
router.get("/:id", userIdValidation("ADMIN"), getAdministratorById)
router.post("/", adminValidation, createAdministrator)
router.patch("/:id", userIdValidation("ADMIN"), updateAdministrator)
router.delete("/:id", userIdValidation("ADMIN"), deleteAdministrator)

export default router
