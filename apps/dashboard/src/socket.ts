import { Event } from "@prisma/client"

export interface ServerToClientEvents {
	newEvent: (event: any) => void
	deletedEvent: (event: any) => void
    updatedEvent: (event: any) => void    
}


