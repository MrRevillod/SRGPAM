// import React, { useEffect, useState } from "react"
// import PageLayout from "../../layouts/PageLayout"
// import FullCalendar from "@fullcalendar/react"
// import dayGridPlugin from "@fullcalendar/daygrid"
// import timeGridPlugin from "@fullcalendar/timegrid"
// import interactionPlugin from "@fullcalendar/interaction"
// import { api } from "../../lib/axios"
// import { useModal } from "../../hooks/modal"
// import CreateEvent from "../../components/forms/create/Event"
// import UpdateEvent from "../../components/forms/update/Event"

// import { Event } from "../../lib/types"

// interface Event2 {
// 	id: string
// 	title: string
// 	start: string
// 	end: string
// }

// const EventsPage: React.FC = () => {
// 	const [events2, setEvents2] = useState<Event2[]>([])
// 	const [events, setEvents] = useState<Event[]>([])

//     const [event,setEvent] = useState<Event>(events[0])
// 	const fetchEvents = async () => {
// 		try {
// 			const { data } = await api.get("/dashboard/events")
// 			const eventos = new Array<Event2>()
// 			data.values.Events.forEach((element: Event) => {
// 				eventos.push({
// 					id:  element.id.toString(),
// 					start: element.startsAt,
// 					end: element.endsAt,
// 					title: element.professionalId,
// 				})
// 			})
// 			setEvents2(eventos)
//             setEvents(data.values.Events)

// 		} catch (err) {
// 			console.log(err)
// 		}
// 	}
// 	const getEvent = (eventId: string) => {
//         const selectedEvent = events.find((ev) => eventId === ev.id.toString())
//         return selectedEvent || events[0]
// 	}
// 	useEffect(() => {
// 		// Fetch events from backend
// 		fetchEvents()
// 	}, [])
// 	const { isModalOpen, showModal, handleOk, handleCancel, modalType, selectedData } = useModal()

// 	return (
// 		<PageLayout pageTitle="Eventos" addFunction={() => showModal("Create", null)} setData={() => {}}>
// 			<FullCalendar
// 				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// 				initialView="dayGridMonth"
// 				events={events2}
//                 eventClick={(event) => {
//                     setEvent(getEvent(event.event.id))
// 					showModal("Edit",null )
// 				}}
// 				headerToolbar={{
// 					left: "prev,next today",
// 					center: "title",
// 					right: "dayGridMonth,timeGridWeek,timeGridDay",
// 				}}
// 				editable={true}
// 				selectable={true}
// 				// Configurar el comportamiento responsive
// 				windowResize={() => {
// 					console.log("Calendar resized!")
// 				}}
// 				height="auto"
// 				// Configuración responsive para diferentes pantallas
// 				views={{
// 					dayGridMonth: {
// 						display: "auto",
// 						dayMaxEventRows: true, // Limita la cantidad de eventos visibles por día
// 					},
// 					timeGridWeek: {
// 						display: "auto",
// 						dayMaxEvents: true,
// 					},
// 					timeGridDay: {
// 						display: "auto",
// 						dayMaxEvents: true,
// 					},
// 				}}
// 			/>
// 			<CreateEvent
// 				data={events}
// 				onCancel={handleCancel}
// 				onOk={handleOk}
// 				setData={setEvents}
// 				visible={isModalOpen && modalType === "Create"}
// 			/>
// 			<UpdateEvent
// 				data={events}
// 				onCancel={handleCancel}
// 				onOk={handleOk}
// 				setData={setEvents}
// 				entity={event}
// 				visible={isModalOpen && modalType === "Edit"}
// 			/>
// 		</PageLayout>
// 	)
// }

// export default EventsPage
