import * as center from "../controllers/centers"
import { Router } from "express"
import { validateSchema } from "../middlewares/validation"
import { validateRole } from "../middlewares/authentication"
import { singleImageupload } from "../config"
import { CentersSchemas } from "@repo/lib"

const { Create, Update } = CentersSchemas

const router: Router = Router()

router.get("/", validateRole("ADMIN"), center.getAll)
router.post("/", validateRole("ADMIN"), singleImageupload, validateSchema(Create), center.create)

router.patch("/:id", validateRole("ADMIN"), singleImageupload, validateSchema(Update), center.updateById)
router.delete("/:id", validateRole("ADMIN"), center.deleteById)

export default router
