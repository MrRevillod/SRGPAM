import { Router } from "express"
import { arrayController, deleteController, profileController } from "./controllers"
import { uploadFields, uploadProfile } from "./multer"

export const router: Router = Router()

router.post("/:id", uploadFields, arrayController)
router.post("/profile/:id", uploadProfile, profileController)
router.delete("/:id", deleteController)
