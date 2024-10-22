import dayjs from "dayjs"
import React from "react"
import DatetimeSelect from "../../ui/DatetimeSelect"

import "react-datetime/css/react-datetime.css"

import { Form } from "../Form"
import { Modal } from "../../Modal"
import { useModal } from "../../../context/ModalContext"
import { useRequest } from "../../../hooks/useRequest"
import { SuperSelect } from "../../ui/SuperSelect"
import { zodResolver } from "@hookform/resolvers/zod"
import { EventSchemas } from "../../../lib/schemas"
import { BooleanSelect } from "../../ui/BooleanSelect"
import { useState, useEffect } from "react"
import { selectDataFormatter } from "../../../lib/formatters"
import { FormProvider, useForm } from "react-hook-form"
import { getCenters, getProfessionals, updateEvent } from "../../../lib/actions"
import { Center, Event, FormProps, Professional, SuperSelectField } from "../../../lib/types"

// Este formulario corresponde a la actualización de un evento
// Se utiliza el componente Modal para mostrar el formulario
// y se utiliza el componente Form para manejar la lógica del formulario

// Recibe una función refetch que permite volver a obtener los eventos al actualizar un evento

const UpdateEvent: React.FC<FormProps<Event>> = ({ refetch }) => {
	const [centers, setCenters] = useState<SuperSelectField[]>([])
	const [professionals, setProfessionals] = useState<SuperSelectField[]>([])

	const methods = useForm({
		resolver: zodResolver(EventSchemas.Update),
	})

	const { selectedData, isModalOpen, modalType } = useModal()

	// Se obtienen los profesionales y centros de atención para mostrarlos en los select
	// Solo se obtienen si el modal está abierto y es de tipo Edit
	// y si el evento seleccionado tiene una Id.

	useRequest<Professional[]>({
		action: getProfessionals,
		query: `serviceId=${selectedData?.serviceId}&select=name,id`,
		onSuccess: (data) => selectDataFormatter({ data, setData: setProfessionals }),
		trigger: isModalOpen && modalType === "Edit" && selectedData?.serviceId,
	})

	// En ambos casos se utiliza una query para obtener solo los campos necesarios
	// esto se hace para evitar traer información innecesaria de la base de datos
	// además mejorando el rendimiento de la aplicación.

	useRequest<Center[]>({
		action: getCenters,
		query: "select=name,id",
		onSuccess: (data) => selectDataFormatter({ data, setData: setCenters }),
		trigger: isModalOpen && modalType === "Edit",
	})

	// selectDataFormatter es una función que recibe un array de objetos
	// y devuelve un array de objetos con la estructura necesaria para los select

	useEffect(() => {
		if (selectedData) {
			methods.reset({
				startsAt: dayjs(selectedData.startsAt).toISOString(),
				endsAt: dayjs(selectedData.endsAt).toISOString(),
			})
		} else {
			methods.reset()
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title="Editar un evento">
			<FormProvider {...methods}>
				<Form action={updateEvent} actionType="update" refetch={refetch} deletable>
					<SuperSelect
						label="Seleccione el profesional"
						name="professionalId"
						options={professionals}
						defaultValue={selectedData?.professionalId}
					/>
					<SuperSelect
						label="Seleccione el centro de atención (opcional)"
						name="centerId"
						options={centers}
						defaultValue={selectedData?.centerId}
					/>
					<SuperSelect
						label="Seleccione el servicio"
						name="serviceId"
						options={[
							{
								label: selectedData?.service?.name,
								value: selectedData?.serviceId,
							},
						]}
						defaultValue={selectedData?.serviceId}
					/>
					<div className="flex gap-2 justify-between">
						<DatetimeSelect label="Inicio del evento" name="startsAt" />
						<DatetimeSelect label="Finalización del evento" name="endsAt" />
					</div>
					<BooleanSelect
						name="assistance"
						defaultValue={selectedData?.assistance}
						options={[
							{ label: "Asistió", value: true },
							{ label: "No asistió", value: false },
						]}
					/>
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default UpdateEvent
