import * as events from "../controllers/events"
import { Router } from "express"
import { EventSchemas } from "@repo/lib"

import { validateSchema, validateUserId } from "../middlewares/validation"

const { Create, Update } = EventSchemas

const router: Router = Router()

router.get("/", events.getAll) //getAll
router.post("/",events.create) //newEvent
router.patch("/:id", validateSchema(Update), events.updateById) //updateEvent
router.delete("/:id", events.deleteById) //updateEvent

export default router
