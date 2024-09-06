import { Router } from "express"
import { upload, seniorsRegisterMobileImages } from "../config"
import { registerSeniorFromMobile, handleSeniorRequest } from "../controllers/seniors"

const router: Router = Router()

router.get("", async (req, res, next) => {})
router.get("/:id", async (req, res, next) => {})
router.patch("/:id", async (req, res, next) => {})
router.delete("/:id", async (req, res, next) => {})
router.get("/new", async (req, res, next) => {})
router.post("/new-mobile", seniorsRegisterMobileImages, registerSeniorFromMobile)
router.post("/pre-checked", async (req, res, next) => {})
router.patch("/:id/new", handleSeniorRequest)
router.post("/:id/profile-picture", upload.single("image1"), (req, res) => {})

export default router
