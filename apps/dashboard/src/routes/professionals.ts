import { Router } from "express"

const router: Router = Router()

router.get("/", async (req, res, next) => {})
router.get("/:id", async (req, res, next) => {})
router.post("/", async (req, res, next) => {})
router.patch("/:id", async (req, res, next) => {})
router.delete("/:id", async (req, res, next) => {})

export default router
