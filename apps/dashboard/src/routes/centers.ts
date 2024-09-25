import * as center from "../controllers/centers"

import { Router } from "express"

import {} from "@repo/lib"

const router: Router = Router()

router.get("/", center.getAll)
export default router
