import * as controllers from "../controllers/seniors"

import { Router } from "express"
import { validateRole } from "../middlewares/authentication"
import { SeniorSchemas } from "@repo/lib"
import { filesValidation, fileValidation } from "../middlewares/file"
import { seniorsRegisterMobileImages, singleImageUpload } from "../config"
import { userOwnerValidation, validateSchema, validateUserId } from "../middlewares/validation"

const { DashboardRegister, MobileRegister, Update } = SeniorSchemas

const router: Router = Router()

// -- Endpoints de adultos mayores

// Obtener todos los adultos mayores
router.get("/", validateRole("ADMIN"), controllers.getAll)

// Crear un adulto mayor prechequeado
router.post("/pre-checked", validateRole("ADMIN"), validateSchema(DashboardRegister), controllers.create)

// Actualizar un adulto mayor por id
router.patch("/:id",singleImageupload, validateUserId("SENIOR"), userOwnerValidation, validateSchema(Update), controllers.updateById)

// Eliminar un adulto mayor por id -- !TODO: Requiere middleware de pertenencia
router.delete("/:id", validateUserId("SENIOR"), userOwnerValidation, controllers.deleteById)

// -- Endpoints adicionales

// Obtener todos los nuevos adultos mayores (sin su cuenta validada)
router.get("/new", validateRole("ADMIN"), controllers.newSeniors)

// Registrar un adulto mayor desde la app móvil
router.post("/new-mobile", seniorsRegisterMobileImages, validateSchema(MobileRegister), filesValidation, controllers.registerFromMobile)

// Actualizar una solicitud registro de adulto mayor (denegar o aceptar)
router.patch("/:id/new", validateRole("ADMIN"), validateUserId("SENIOR"), controllers.handleSeniorRequest)

// Verificar si el RUT o email ya existe en la base de datos
router.post("/check-unique", controllers.checkUnique)

export default router
