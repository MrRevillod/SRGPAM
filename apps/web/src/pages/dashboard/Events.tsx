import React, { useEffect, useState } from "react"
import PageLayout from "../../layouts/PageLayout"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { api } from "../../lib/axios"
import CreateEvent from "../../components/forms/create/Event"
import UpdateEvent from "../../components/forms/update/Event"

import { Event } from "../../lib/types"
import { useModal } from "../../context/ModalContext"
import { EventSourceInput } from "@fullcalendar/core/index.js" 

const EventsPage: React.FC = () => {
	const [fullEvents, setfullEvents] = useState<EventSourceInput>([])
	const [events, setEvents] = useState<Event[]>([])

	const [event, setEvent] = useState<Event>(events[0])

	const { showModal } = useModal()
	const fetchEvents = async () => {
		try {
			const { data } = await api.get("/dashboard/events")
            const eventos = new Array<EventSourceInput>()
            console.log(data.values.Events)
			data.values.Events.forEach((element: Event) => {
				eventos.push({
					id: element.id.toString(),
					start: element.startsAt,
					end: element.endsAt,
                    title: element.service.name,
                    backgroundColor:element.service.color,
                    
				})
			})
			setfullEvents(eventos)
			setEvents(data.values.Events)
		} catch (err) {
			console.log(err)
		}
	}
	const getEvent = (eventId: string) => {
		const selectedEvent = events.find((ev) => eventId === ev.id.toString())
		return selectedEvent || events[0]
	}
	useEffect(() => {
		// Fetch events from backend
        fetchEvents()
        
	}, [])

	return (
		<PageLayout pageTitle="Eventos" create={true}>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={fullEvents}
				eventClick={(event) => {
					showModal("Edit", getEvent(event.event.id))
				}}
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
			<CreateEvent data={events} setData={setEvents} />
			<UpdateEvent data={events} setData={setEvents} />
		</PageLayout>
	)
}

export default EventsPage
