import * as services from "../controllers/services"
import { validateSchema } from "../middlewares/validation"
import { validateRole } from "../middlewares/authentication"
import { Router } from "express"
import { ServiceSchemas } from "@repo/lib"

const { Create, Update } = ServiceSchemas

const router: Router = Router()

router.get("/", validateRole("ADMIN"), services.getAll)
router.post("/", validateRole("ADMIN"), validateSchema(Create), services.create)

router.patch("/:id", validateRole("ADMIN"), validateSchema(Update), services.updateById)
router.delete("/:id", validateRole("ADMIN"), services.deleteById)

export default router
