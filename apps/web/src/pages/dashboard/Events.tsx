import React, { useEffect, useState } from "react"
import PageLayout from "../../layouts/PageLayout"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { api } from "../../lib/axios"

type Event = {
	id: string // Equivalente de Int en Prisma
	startsAt: string // DateTime en Prisma es Date en TypeScript
	endsAt: string
	assistance: boolean // Boolean en Prisma es boolean en TS

	createdAt: Date
	updatedAt: Date

	seniorId?: string | null // Campos opcionales en Prisma se traducen a `| null` o con `?`
	professionalId: string
	centerId?: number | null
	serviceId?: number | null
}

interface Event2 {
	id: string
	title: string
	start: string
	end: string
}

const EventsPage: React.FC = () => {
	const [events, setEvents] = useState<Event2[]>([])

	const fetchEvents = async () => {
		try {
			const { data } = await api.get("/dashboard/events")
			const eventos = new Array<Event2>()
			data.values.Events.forEach((element: Event) => {
				eventos.push({
					id: element.id,
					start: element.startsAt,
					end: element.endsAt,
					title: element.professionalId,
				})
			})
			setEvents(eventos)
		} catch (err) {
			console.log(err)
		}
	}
	useEffect(() => {
		// Fetch events from backend
		fetchEvents()
	}, [])

	return (
		<PageLayout pageTitle="Eventos" addFunction={() => {}} setData={() => {}}>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={events}
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay",
				}}
				editable={true}
				selectable={true}
				// Configurar el comportamiento responsive
				windowResize={() => {
					console.log("Calendar resized!")
				}}
				height="auto"
				// Configuración responsive para diferentes pantallas
				views={{
					dayGridMonth: {
						display: "auto",
						dayMaxEventRows: true, // Limita la cantidad de eventos visibles por día
					},
					timeGridWeek: {
						display: "auto",
						dayMaxEvents: true,
					},
					timeGridDay: {
						display: "auto",
						dayMaxEvents: true,
					},
				}}
			/>
		</PageLayout>
	)
}

export default EventsPage
