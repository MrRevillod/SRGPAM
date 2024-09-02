import { Router } from "express"
import { arrayController, deleteController} from "./controllers"
import { validateArray} from "./middlewares"

export const router: Router = Router()

// router.get("/:id", getController)

// router.post("/single/:id", validateFile, singleController)
router.post("/:id", validateArray, arrayController)

router.delete("/:id", deleteController)
