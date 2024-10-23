import { Event } from "@prisma/client"
import { AppError } from "@repo/lib"

export const canAddEvent = (events: Event[], newEvent: { startsAt: Date; endsAt: Date }): boolean => {
	// Ordenar los eventos por la fecha de inicio
	events.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())

	// Revisar si el nuevo evento se superpone con los eventos existentes
	for (let i = 0; i < events.length; i++) {
		const event = events[i]

		// Si el nuevo evento termina antes de que el evento actual comience, no hay superposición
		if (newEvent.endsAt <= newEvent.startsAt) {
			throw new AppError(400, "Rango de tiempo invalido")
		}

		if (newEvent.endsAt <= event.startsAt) {
			continue
		}

		// Si el nuevo evento comienza después de que el evento actual termine, no hay superposición
		if (newEvent.startsAt >= event.endsAt) {
			continue
		}

		// Si cae aquí, entonces hay superposición
		return false
	}

	// Si pasa todas las validaciones, entonces se puede agregar el nuevo evento sin superposición
	return true
}
