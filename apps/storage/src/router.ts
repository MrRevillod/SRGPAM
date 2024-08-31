import { JsonResponse } from "@repo/lib"
import { Router } from "express"
import { arrayController, deleteController, getController, singleController } from "./controllers"
import { validateArray, validateFile } from "./middlewares"

export const router: Router = Router()

router.get("/:id", getController)

router.post("/single/:id", validateFile, singleController)
router.post("/:id", validateArray, arrayController)

router.delete("/:id", deleteController)
