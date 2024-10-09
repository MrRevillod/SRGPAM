import * as events from "../controllers/events"
import { Router } from "express"
import { EventSchemas } from "@repo/lib"

import { validateSchema } from "../middlewares/validation"
import { validateRole } from "../middlewares/authentication"

const { Create, Update } = EventSchemas

const router: Router = Router()

router.get("/", events.getAll) //getAll
router.post("/", validateSchema(Create), events.create) //newEvent
router.patch("/:id", validateSchema(Update), events.updateById) //updateEvent
router.patch("/:id/reservate", validateRole("SENIOR"), events.reserveEvent)
router.delete("/:id", events.deleteById) //updateEvent

export default router
