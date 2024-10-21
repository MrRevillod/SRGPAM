import React, { useEffect } from "react"
import dayjs from "dayjs"
import DatetimeSelect from "../../ui/DatetimeSelect"

import "react-datetime/css/react-datetime.css"

import { Form } from "../Form"
import { Modal } from "../../Modal"
import { useModal } from "../../../context/ModalContext"
import { useState } from "react"
import { useRequest } from "../../../hooks/useRequest"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation } from "react-router-dom"
import { SuperSelect } from "../../ui/SuperSelect"
import { EventSchemas } from "../../../lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { getIdFromUrl, selectDataFormatter } from "../../../lib/formatters"
import { createEvent, getCenters, getProfessionals, getServices } from "../../../lib/actions"
import { Center, Event, FormProps, Professional, Service, SuperSelectField } from "../../../lib/types"

// El formulario recibe refetch, ya que en este caso es más conveniente que
// filtrar los evento en el cliente, se vuelvan a obtener los eventos desde el servidor

const CreateEvent: React.FC<FormProps<Event>> = ({ data, setData, refetch }) => {
	const location = useLocation()

	const [centers, setCenters] = useState<SuperSelectField[]>([])
	const [services, setServices] = useState<SuperSelectField[]>([])
	const [professionals, setProfessionals] = useState<SuperSelectField[]>([])

	const methods = useForm({
		resolver: zodResolver(EventSchemas.Create),
	})

	const { isModalOpen, modalType } = useModal()

	// Se obtiene el id del centro de la url, con el fin de seleccionarlo por defecto
	// ya que es posible crear un evento desde la url de un centro

	const selectedCenter = getIdFromUrl(location)

	// Se obtiene el servicio seleccionado, con el fin de obtener los profesionales
	// que ofrecen ese servicio, al utilizar watch se obtiene el valor del input
	// en tiempo real y se puede utilizar para realizar peticiones

	const selectedService = methods.watch("serviceId")

	// Los hooks useRequest se utilizan para obtener los servicios, profesionales y centros
	// reciben un trigger que actua como un disparador de un useEffect

	// Se obtienen los servicios cuando se abre el modal
	useRequest<Service[]>({
		action: getServices,
		query: "select=name,id",
		onSuccess: (data) => selectDataFormatter({ data, setData: setServices }),
		trigger: isModalOpen && modalType === "Create",
	})

	// Se obtienen los servicios cuando se selecciona un servicio y el modal está abierto
	useRequest<Professional[]>({
		action: getProfessionals,
		query: `serviceId=${selectedService}&select=name,id`,
		onSuccess: (data) => selectDataFormatter({ data, setData: setProfessionals }),
		trigger: selectedService && isModalOpen && modalType === "Create",
	})

	// Se obtienen los centros cuando se abre el modal
	useRequest<Center[]>({
		action: getCenters,
		query: "select=name,id",
		onSuccess: (data) => selectDataFormatter({ data, setData: setCenters }),
		trigger: isModalOpen && modalType === "Create",
	})

	// Se obtiene el valor del input startsAt
	// y se agrega 2 horas al valor de endsAt ya que esto brinda una mejor experiencia

	const startsAt = methods.watch("startsAt")

	useEffect(() => {
		if (startsAt) {
			methods.setValue("endsAt", dayjs(startsAt).add(2, "hour").toISOString())
		}
	}, [startsAt])

	// console.log(methods.watch())

	return (
		<Modal type="Create" title="Crear un nuevo evento">
			<FormProvider {...methods}>
				<Form data={data} setData={setData} action={createEvent} actionType="update" refetch={refetch}>
					<SuperSelect label="Seleccione un servicio" name="serviceId" options={services} />
					<SuperSelect label="Seleccione un profesional" name="professionalId" options={professionals} />
					<SuperSelect
						label="Seleccione un centro de atención"
						name="centerId"
						options={centers}
						defaultValue={selectedCenter ? Number(selectedCenter) : undefined}
					/>
					<div className="flex gap-2 justify-between">
						<DatetimeSelect label="Inicio del evento" name="startsAt" />
						<DatetimeSelect label="Término del evento" name="endsAt" />
					</div>
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default CreateEvent
