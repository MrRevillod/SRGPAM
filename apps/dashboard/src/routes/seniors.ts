import { Router } from "express"

const router: Router = Router()

router.get("", async (req, res, next) => {})
router.get("/:id", async (req, res, next) => {})
router.patch("/:id", async (req, res, next) => {})
router.delete("/:id", async (req, res, next) => {})
router.get("/new", async (req, res, next) => {})
router.patch("/:id/deny", async (req, res, next) => {})
router.patch("/:id/validate", async (req, res, next) => {})
router.post("/mobile", async (req, res, next) => {})
router.post("/pre-checked", async (req, res, next) => {})
router.post("/:id/profile-picture", async (req, res, next) => {})

export default router
