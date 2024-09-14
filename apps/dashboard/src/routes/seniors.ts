import { Router } from "express"
import { upload, seniorsRegisterMobileImages } from "../config"

import {
	registerSeniorFromMobile,
	handleSeniorRequest,
	getAllSeniors,
	getSeniorById,
	createSenior,
	updateSeniorById,
	deleteSeniorById,
	loginSeniorMobile,
} from "../controllers/seniors"

import { fileValidation } from "../middlewares/file"
import { seniorValidation, userIdValidation } from "../middlewares/validation"

const router: Router = Router()

router.get("", getAllSeniors)
router.get("/:id", userIdValidation("SENIOR"), getSeniorById)
router.patch("/:id", userIdValidation("SENIOR"), updateSeniorById)
router.delete("/:id", userIdValidation("SENIOR"), deleteSeniorById)
router.post("/pre-checked", createSenior) // TODO: Añana la validación de los datos
router.post("/new-mobile", seniorsRegisterMobileImages, seniorValidation, fileValidation, registerSeniorFromMobile)
router.post("/login", loginSeniorMobile)

router.get("/new", async (req, res, next) => {})
router.patch("/:id/new", userIdValidation("SENIOR"), handleSeniorRequest)
router.post("/:id/profile-picture", upload.single("image1"), (req, res) => {})

export default router
