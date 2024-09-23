import * as controllers from "../controllers/seniors"

import { Router } from "express"
import { validateRole } from "../middlewares/authentication"
import { filesValidation, fileValidation } from "../middlewares/file"
import { fieldsValidation, validateUserId } from "../middlewares/validation"
import { seniorsRegisterMobileImages, seniorsProfileImage } from "../config"

const router: Router = Router()

// -- Endpoints de adultos mayores

// Obtener todos los adultos mayores
router.get("/", validateRole("ADMIN"), controllers.getAll)

// Crear un adulto mayor prechequeado
router.post("/pre-checked", validateRole("ADMIN"), fieldsValidation("SENIOR", "DashboardRegister"), controllers.create)

// Actualizar un adulto mayor por id -- !TODO: Requiere middleware de pertenencia
router.patch("/:id", validateUserId("SENIOR"), fieldsValidation("SENIOR", "Update"), controllers.updateById)

// Eliminar un adulto mayor por id -- !TODO: Requiere middleware de pertenencia
router.delete("/:id", validateUserId("SENIOR"), controllers.deleteById)

// -- Endpoints adicionales

// Obtener todos los nuevos adultos mayores (sin su cuenta validada)
router.get("/new", validateRole("ADMIN"), controllers.newSeniors)

// Registrar un adulto mayor desde la app móvil
router.post("/new-mobile", seniorsRegisterMobileImages, fieldsValidation("SENIOR", "MobileRegister"), filesValidation, controllers.registerFromMobile)

// Actualizar una solicitud registro de adulto mayor (denegar o aceptar)
router.patch("/:id/new", controllers.handleSeniorRequest)

// Subir imagen de perfil de adulto mayor !TODO: Cambiar a req.params
router.post("/profile", seniorsProfileImage, fileValidation, controllers.uploadProfilePicture)

export default router
