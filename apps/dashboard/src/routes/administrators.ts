import * as administrators from "../controllers/administrators"

import { Router } from "express"
import { fieldsValidation, validateUserId } from "../middlewares/validation"

const router: Router = Router()

// -- Endpoints CRUD

// Obtener todos los administradores
router.get("/", administrators.getAll)

// Crear un administrador
router.post("/", fieldsValidation("ADMIN", "Create"), administrators.create)

// Actualizar un administrador por id -- !TODO: Requiere middleware de pertenencia
router.patch("/:id", validateUserId("ADMIN"), fieldsValidation("ADMIN", "Update"), administrators.updateById)

// Eliminar un administrador por id -- !TODO: Requiere middleware de pertenencia
router.delete("/:id", validateUserId("ADMIN"), administrators.deleteById)

export default router
