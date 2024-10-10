import React, { useEffect, useState } from "react"
import Form from "../Form"
import "react-datetime/css/react-datetime.css"
import { EventSchemas } from "../../../lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Event, FormProps, Professional, Service } from "../../../lib/types"
import { api } from "../../../lib/axios"
import { SuperSelect } from "../../ui/SuperSelect"
import { Modal } from "../../Modal"
import { DatePicker } from "../../ui/InputDate"
import DatetimeSelect from "../../ui/DatetimeSelect"
import locale from "antd/locale/es_ES"
import { ConfigProvider } from "antd"

type SelectValues = {
	value: string | number
	label: string
}
const CreateEvent: React.FC<FormProps<Event>> = ({ data, setData }) => {
	const methods = useForm({
		resolver: zodResolver(EventSchemas.Create),
	})

	const [professionals, setProfessionals] = useState<SelectValues[]>()
	const [services, setServices] = useState<SelectValues[]>()
	const [date, setDate] = useState<Date>()

	const getProfessionals = async () => {
		const res = await api.get("/dashboard/professionals")
		const values = res.data.values?.professionals
		const proffesionals_tem = new Array<SelectValues>()
		values.forEach((pfs: Professional) => {
			proffesionals_tem.push({
				label: pfs.name,
				value: pfs.id,
			})
		})
		setProfessionals(proffesionals_tem)
	}
	const getServices = async () => {
		const res = await api.get("/dashboard/services")
		const values = res.data.values?.services
		const temp = new Array<SelectValues>()
		values.forEach((pfs: Service) => {
			temp.push({
				label: pfs.name,
				value: pfs.id,
			})
		})
		setServices(temp)
	}

	useEffect(() => {
		getProfessionals()
		getServices()
	}, [])

	return (
		<Modal type="Create" title="Crear un nuevo evento">
			<FormProvider {...methods}>
				<ConfigProvider locale={locale}>
					<Form
						entityName="Evento"
						data={data}
						setData={setData}
						apiEndpoint="/dashboard/events/"
						method="POST"
					>
						<SuperSelect label="Seleccione el profesional" name="professionalId" options={professionals} />

						<SuperSelect label="Seleccione el servicio" name="serviceId" options={services} />
						<div className="flex  gap-2 justify-between">
							<DatetimeSelect label="Seleccione fecha y hora de inicio del evento" name="startsAt" />
							<DatetimeSelect label="Seleccione fecha y hora de término del evento" name="endsAt" />
						</div>
					</Form>
				</ConfigProvider>
			</FormProvider>
		</Modal>
	)
}

export default CreateEvent
