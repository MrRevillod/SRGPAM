import * as centers from "../controllers/centers"

import { Router } from "express"
import { validateRole } from "../middlewares/authentication"
import { validateSchema } from "../middlewares/validation"
import { CentersSchemas } from "@repo/lib"
import { singleImageupload } from "../config"

const { Create, Update } = CentersSchemas

const router: Router = Router()

// -- Endpoints CRUD

// Obtener todos los centros
router.get("/", validateRole("ADMIN"), centers.getAll)

// Crear un centro de atención, requiere validación de rol ADMIN.
router.post("/", singleImageupload, validateRole("ADMIN"), validateSchema(Create), centers.create)

// Actualizar un centro de atención por id, requiere validación de rol ADMIN.
router.patch("/:id", singleImageupload, validateRole("ADMIN"), singleImageupload, validateSchema(Update), centers.updateById)

// Eliminar un centro de atención por id requiere validación de rol ADMIN.
router.delete("/:id", validateRole("ADMIN"), centers.deleteById)

export default router
