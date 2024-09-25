import * as services from "../controllers/services"
import { validateSchema } from "../middlewares/validation"
import { Router } from "express"
import { ServiceSchemas } from "@repo/lib"

const { Create, Update } = ServiceSchemas

const router: Router = Router()

router.get("/", services.getAll)
router.post("/", validateSchema(Create), services.create)

router.patch("/:id", validateSchema(Update), services.updateById)
router.delete("/:id", services.deleteById)

export default router
