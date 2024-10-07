import * as administrators from "../controllers/administrators"

import { Router } from "express"
import { validateRole } from "../middlewares/authentication"
import { singleImageupload } from "../config"
import { AdministratorSchemas } from "@repo/lib"
import { validateSchema, validateUserId } from "../middlewares/validation"

const { Create, Update } = AdministratorSchemas

const router: Router = Router()

// -- Endpoints CRUD

// Obtener todos los administradores
router.get("/", validateRole("ADMIN"), administrators.getAll)

// Crear un administrador
router.post("/", validateRole("ADMIN"), validateSchema(Create), administrators.create)

// Actualizar un administrador por id -- !TODO: Requiere middleware de pertenencia
router.patch("/:id", singleImageupload, validateRole("ADMIN"), validateUserId("ADMIN"), validateSchema(Update), administrators.updateById)

// Eliminar un administrador por id -- !TODO: Requiere middleware de pertenencia
router.delete("/:id", validateRole("ADMIN"), validateUserId("ADMIN"), administrators.deleteById)

export default router
