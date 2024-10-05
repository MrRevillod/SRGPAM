import { Event } from "@prisma/client"

export interface ServerToClientEvents {
	newEvent: (event: Event) => void
	deletedEvent: (event: Event) => void
    updatedEvent: (event: Event) => void    
}


