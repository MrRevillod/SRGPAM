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
} from "../controllers/seniors"

const router: Router = Router()

router.get("", getAllSeniors)
router.get("/:id", getSeniorById)
router.patch("/:id", updateSeniorById)
router.delete("/:id", deleteSeniorById)
router.get("/new", async (req, res, next) => {})
router.post("/new-mobile", seniorsRegisterMobileImages, registerSeniorFromMobile)
router.post("/pre-checked", createSenior)
router.patch("/:id/new", handleSeniorRequest)
router.post("/:id/profile-picture", upload.single("image1"), (req, res) => {})

export default router
