import React from "react"
import esLocale from "@fullcalendar/core/locales/es"
import PageLayout from "../../layouts/PageLayout"
import CreateEvent from "../../components/forms/create/Event"
import UpdateEvent from "../../components/forms/update/Event"
import FullCalendar from "@fullcalendar/react"
import ConfirmAction from "../../components/ConfirmAction"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import { Event } from "../../lib/types"
import { message } from "antd"
import { useModal } from "../../context/ModalContext"
import { useSocket } from "../../context/SocketContext"
import { useRequest } from "../../hooks/useRequest"
import { useLocation } from "react-router-dom"
import { EventSourceInput } from "@fullcalendar/core/index.js"
import { useEffect, useState } from "react"
import { deleteEvent, getEvents } from "../../lib/actions"

const EventsPage: React.FC = () => {
	const location = useLocation()
	const [pageQuery, setPageQuery] = useState<string>("")

	const [events, setEvents] = useState<Event[]>([])
	const [formattedEvents, setFormattedEvents] = useState<EventSourceInput>([])

	const { socket } = useSocket()
	const { showModal } = useModal()

	// Se obtiene la query de la URL para utilizarla en el filtro de eventos
	useEffect(() => {
		setPageQuery(new URLSearchParams(location.search).toString())
	}, [location])

	const eventsFormat = (events: Event[]) => {
		return events.map((event) => ({
			id: event.id.toString(),
			start: event.startsAt,
			end: event.endsAt,
			title: event.service.name,
			backgroundColor: event.service.color,
		}))
	}

	const getEvent = (eventId: string) => {
		const selectedEvent = events.find((ev) => eventId === ev.id.toString())
		return selectedEvent || events[0]
	}

	// Se obtienen los eventos de la base de datos
	// y se formatean para ser mostrados en el calendario
	// refetch es una función que permite volver a obtener los eventos
	// en caso de que se realice alguna acción que modifique los eventos

	const { error, refetch } = useRequest<Event[]>({
		action: getEvents,
		query: pageQuery,
		onSuccess: (events) => {
			setEvents(events as Event[])
			setFormattedEvents(eventsFormat(events as Event[]))
		},
	})

	socket?.off("updatedEvent")
	socket?.on("updatedEvent", () => refetch())

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout pageTitle="Agenda y horas de atención" create>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={formattedEvents}
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

			<CreateEvent data={events} setData={setEvents} refetch={refetch} />
			<UpdateEvent data={events} setData={setEvents} refetch={() => {}} />

			<ConfirmAction<Event>
				text="¿Estás seguro(a) de que deseas eliminar este evento?"
				data={events}
				setData={setEvents}
				action={deleteEvent}
				refetch={refetch}
			/>
		</PageLayout>
	)
}

export default EventsPage
