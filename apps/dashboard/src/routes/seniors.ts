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
} from "../controllers/seniors"

import { fileValidation } from "../middlewares/file"
import { seniorValidation, userIdValidation } from "../middlewares/validation"

const router: Router = Router()

router.get("", getAllSeniors)
router.get("/new", newSeniors)
router.get("/:id", userIdValidation("SENIOR"), getSeniorById)
router.patch("/:id", userIdValidation("SENIOR"), updateSeniorById)
router.delete("/:id", userIdValidation("SENIOR"), deleteSeniorById)
router.post("/pre-checked", createSenior) // TODO: Añana la validación de los datos
router.post("/new-mobile", seniorsRegisterMobileImages, seniorValidation, fileValidation, registerSeniorFromMobile)

router.patch("/:id/new", userIdValidation("SENIOR"), handleSeniorRequest)
router.post("/:id/profile", seniorsProfileImage, (req, res) => {
	res.status(200).json({
		message: "Imagen recibida",
	})
})

export default router
