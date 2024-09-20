import { Router } from "express"
import { upload, seniorsRegisterMobileImages, seniorsProfileImage } from "../config"

import {
	registerSeniorFromMobile,
	handleSeniorRequest,
	getAllSeniors,
	getSeniorById,
	createSenior,
	updateSeniorById,
	deleteSeniorById,
	newSeniors,
    uploadProfilePicture,
} from "../controllers/seniors"

import { filesValidation, fileValidation } from "../middlewares/file"
import { seniorValidation, userIdValidation } from "../middlewares/validation"

const router: Router = Router()

router.get("", getAllSeniors)
router.get("/new", newSeniors)
router.get("/:id", userIdValidation("SENIOR"), getSeniorById)
router.patch("/:id", userIdValidation("SENIOR"), updateSeniorById)
router.delete("/:id", userIdValidation("SENIOR"), deleteSeniorById)
router.post("/pre-checked", createSenior) // TODO: Añana la validación de los datos
router.post("/new-mobile", seniorsRegisterMobileImages, seniorValidation, filesValidation, registerSeniorFromMobile)

router.patch("/:id/new", userIdValidation("SENIOR"), handleSeniorRequest)
router.post("/profile", seniorsProfileImage, fileValidation, uploadProfilePicture)

export default router
