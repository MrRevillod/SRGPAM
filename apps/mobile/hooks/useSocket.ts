import { useEffect, useState } from "react"
import { connectSocket, disconnectSocket, listenToEvent, emitEvent } from "@/services/socket"

// hook general socket
export const useSocket = (eventName: string, eventCallback: (data: any) => void, userRole: string, userId: string) => {
	useEffect(() => {
		connectSocket(userRole, userId)
		listenToEvent(eventName, eventCallback)

		return () => {
			disconnectSocket()
		}
	}, [eventName, eventCallback, userRole, userId])

	const sendEvent = (eventName: string, data: any) => {
		emitEvent(eventName, data)
	}

	return { sendEvent }
}

// emitir eventos de actualización de horas
const useUpdateHours = (userRole: string, userId: string) => {
	useEffect(() => {
		connectSocket(userRole, userId)
		return () => {
			disconnectSocket()
		}
	}, [userRole, userId])

	// Asignar un adulto mayor a un evento
	const assignSeniorToEvent = (eventId: number, seniorId: number) => {
		emitEvent("set-event-senior", { eventId, seniorId })
	}

	//   Elimnar Senior de un evento
	const deleteSeniorFromEvent = (eventId: number, seniorId: number) => {
		emitEvent("delete-senior", { eventId, seniorId })
	}

	return { assignSeniorToEvent, deleteSeniorFromEvent }
}

export default useUpdateHours

// escuchar eventos no asignados a seniors
export const useListenEvents = (userRole: string, userId: string) => {
	const [unassignedEvents, setUnassignedEvents] = useState([])

	useEffect(() => {
		connectSocket(userRole, userId)

		// escuchar eventos de actualización de horas
		listenToEvent("hours-updated", (newHours) => {
			console.log("Horas de atención actualizadas:", newHours)
		})

		// escuchar eventos libres (sin adulto mayor asignado)
		listenToEvent("unassigned-events", (events) => {
			setUnassignedEvents(events)
			console.log("Eventos sin seniors asignados:", events)
		})

		return () => {
			disconnectSocket()
		}
	}, [userRole, userId])

	return { unassignedEvents }
}
