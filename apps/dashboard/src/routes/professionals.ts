import * as professionals from "../controllers/professionals"

import { Router } from "express"
import { validateRole } from "../middlewares/authentication"
import { validateSchema, validateUserId } from "../middlewares/validation"

import { singleImageupload } from "../config"
import { ProfessionalSchemas } from "@repo/lib"

const { Create, Update } = ProfessionalSchemas

const router: Router = Router()

// -- Endpoints CRUD

// Obtener todos los profesionales
router.get("/", validateRole("ADMIN"), professionals.getAll)

// Crear un profesional, requiere validación de rol ADMIN.
router.post("/", validateSchema(Create), validateRole("ADMIN"), professionals.create)

// Actualizar un profesional por id -- !TODO: Requiere middleware de pertenencia
router.patch("/:id", singleImageupload, validateUserId("PROFESSIONAL"), validateSchema(Update), professionals.updateById)

// Eliminar un profesional por id -- !TODO: Requiere middleware de pertenencia
router.delete("/:id", validateUserId("PROFESSIONAL"), professionals.deleteById)

export default router
