import React, { useEffect, useState } from "react"
import Form from "../Form"
import "react-datetime/css/react-datetime.css"
import { EventSchemas } from "../../../lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Event, FormProps, Professional, Service } from "../../../lib/types"
import { api } from "../../../lib/axios"
import { SuperSelect } from "../../ui/SuperSelect"
import Loading from "../../Loading"
import { Modal } from "../../Modal"
import { ModalProvider, useModal } from "../../../context/ModalContext"
import DatetimeSelect from "../../ui/DatetimeSelect"
import dayjs from "dayjs"
import { Input } from "../../ui/Input"
import { BooleanSelect } from "../../ui/BooleanSelect"

type SelectValues = {
	value: string | number
	label: string
}
const UpdateEvent: React.FC<FormProps<Event>> = ({ data, setData }) => {
	const methods = useForm({
		resolver: zodResolver(EventSchemas.Update),
	})
	const { selectedData, showModal } = useModal()

	const [professionals, setProfessionals] = useState<SelectValues[]>()
	// const [services, setServices] = useState<SelectValues[]>()
	const [centers, setCenters] = useState<SelectValues[]>()

	const getProfessionals = async () => {
		const res = await api.get("/dashboard/professionals")
		const values = await res.data.values?.professionals
		const proffesionals_tem = new Array<SelectValues>()
		values.forEach((pfs: Professional) => {
			proffesionals_tem.push({
				label: pfs.name,
				value: pfs.id,
			})
		})
		setProfessionals(proffesionals_tem)
	}

	// const getServices = async () => {
	// 	const res = await api.get("/dashboard/services")
	// 	const values = await res.data.values?.services

	// 	const temp = new Array<SelectValues>()

	// 	values.forEach((pfs: Service) => {
	// 		temp.push({
	// 			label: pfs.name,
	// 			value: pfs.id,
	// 		})
	// 	})
	// 	setServices(temp)
	// }

	const getCenters = async () => {
		const res = await api.get("/dashboard/centers")
		const values = await res.data.values?.centers

		const temp = new Array<SelectValues>()

		values.forEach((pfs: Service) => {
			temp.push({
				label: pfs.name,
				value: pfs.id,
			})
		})
		setCenters(temp)
	}

	useEffect(() => {
		if (selectedData) {
			methods.setValue("serviceId", selectedData.serviceId)
		}
		getProfessionals()
		// getServices()
        getCenters()
        console.log(selectedData)
	}, [selectedData])

	return (
		<Modal type="Edit" title="Editar un evento">
			<FormProvider {...methods}>
				<Form
					entityName="Evento"
					data={new Array<any>()}
					setData={() => {}}
					apiEndpoint={`/dashboard/events/${selectedData?.id}`}
					method="PATCH"
					deleteable
				>
					<SuperSelect
						label="Seleccione el profesional"
						name="professionalId"
						options={professionals}
						defaultValue={selectedData?.professionalId}
					/>
					{/* <SuperSelect
						label="Seleccione el servicio"
						name="serviceId"
						options={services}
						defaultValue={selectedData?.serviceId}
					/> */}

					<SuperSelect
						label="Seleccione el centro de atención (opcional)"
						name="centerId"
						options={centers}
						defaultValue={selectedData?.centerId}
					/>
					<div className="flex  gap-2 justify-between">
						<DatetimeSelect
							label="Seleccione fecha y hora de inicio del evento"
							name="startsAt"
							defaultValue={dayjs(selectedData?.startsAt)}
						/>
						<DatetimeSelect
							label="Seleccione fecha y hora de término del evento"
							name="endsAt"
							defaultValue={dayjs(selectedData?.endsAt)}
						/>
					</div>
                    <BooleanSelect
                        name={"assistance"}
                        defaultValue={selectedData?.assistance}
                        options={[
                            { label: "Asistió", value: true },
                            { label: "No asistió", value: false },
                        ]}
                        setValue={methods.setValue}
                    />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default UpdateEvent
