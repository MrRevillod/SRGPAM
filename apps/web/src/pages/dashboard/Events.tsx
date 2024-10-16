import React, { useEffect, useState } from "react"
import PageLayout from "../../layouts/PageLayout"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { api } from "../../lib/axios"
import CreateEvent from "../../components/forms/create/Event"
import UpdateEvent from "../../components/forms/update/Event"
import ConfirmAction from "../../components/ConfirmAction"

import { Event } from "../../lib/types"
import { useModal } from "../../context/ModalContext"
import { EventSourceInput } from "@fullcalendar/core/index.js"

import esLocale from "@fullcalendar/core/locales/es"
import { deleteEvent } from "../../lib/actions"

const EventsPage: React.FC = () => {
	const [fullEvents, setfullEvents] = useState<EventSourceInput>([])
	const [events, setEvents] = useState<Event[]>([])

	const { showModal, isModalOpen } = useModal()
	const eventsFormat = (events: any[]) => {
		const eventos = new Array<EventSourceInput>()
		events.forEach((element: Event) => {
			//@ts-ignore
			eventos.push({
				id: element.id.toString(),
				//@ts-ignore
				start: element.startsAt,
				end: element.endsAt,
				//@ts-ignore
				title: element.service.name,
				//@ts-ignore
				backgroundColor: element.service.color,
			})
		})
		return eventos
	}
	const fetchEvents = async () => {
		try {
			const { data } = await api.get("/dashboard/events")
			const evs = eventsFormat(data.values.Events) as EventSourceInput
			setfullEvents(evs)
			setEvents(data.values.Events)
		} catch (err) {
			console.log(err)
		}
	}
	const handleDelete = async (event: any) => {
		try {
			const response = await api.delete(`/dashboard/events/${event.id}`)
			return response
		} catch (error) {
			console.error("Error en el delete:", error)
		}
	}

	const getEvent = (eventId: string) => {
		const selectedEvent = events.find((ev) => eventId === ev.id.toString())
		return selectedEvent || events[0]
	}
	useEffect(() => {
		// Fetch events from backend
		fetchEvents()
	}, [isModalOpen])

	useEffect(() => {
		const evs = eventsFormat(events) as EventSourceInput
		setfullEvents(evs)
	}, [events])

	return (
		<PageLayout pageTitle="Agenda y horas de atención" create={true}>
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
				locale={esLocale}
				editable={true}
				selectable={true}
				// Configurar el comportamiento responsive
				windowResize={() => {}}
				height="auto"
				timeZone="local"
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
			<ConfirmAction<Event>
				text="¿Estás seguro(a) de que deseas eliminar este evento?"
				data={events}
				setData={setEvents}
				action={deleteEvent}
			/>
		</PageLayout>
	)
}

export default EventsPage
