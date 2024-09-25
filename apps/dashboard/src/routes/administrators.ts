import * as administrators from "../controllers/administrators"

import { Router } from "express"
import { AdministratorSchemas } from "@repo/lib"
import { validateSchema, validateUserId } from "../middlewares/validation"

const { Create, Update } = AdministratorSchemas

const router: Router = Router()

// -- Endpoints CRUD

// Obtener todos los administradores
router.get("/", administrators.getAll)

// Crear un administrador
router.post("/", validateSchema(Create), administrators.create)

// Actualizar un administrador por id -- !TODO: Requiere middleware de pertenencia
router.patch("/:id", validateUserId("ADMIN"), validateSchema(Update), administrators.updateById)

// Eliminar un administrador por id -- !TODO: Requiere middleware de pertenencia
router.delete("/:id", validateUserId("ADMIN"), administrators.deleteById)

export default router
