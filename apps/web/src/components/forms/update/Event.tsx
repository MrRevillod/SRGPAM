import React, { useEffect, useState } from "react"
import Form from "../Form"
import "react-datetime/css/react-datetime.css"
import { EventSchemas } from "../../../lib/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Event, Professional, Service, UpdateEntityFormProps } from "../../../lib/types"
import { DatetimeSelect } from "../../ui/DatetimeSelect"
import { api } from "../../../lib/axios"
import { SuperSelect } from "../../ui/SuperSelect"
import Loading from "../../Loading"

type SelectValues = {
	value: string | number
	label: string
}
const UpdateEvent: React.FC<UpdateEntityFormProps<Event>> = ({ visible, onCancel, onOk, data, setData, entity }) => {
	const formContext = useForm({
		resolver: zodResolver(EventSchemas.Update),
		defaultValues: {
			startsAt: new Date(entity?.startsAt || "").valueOf(),
			endsAt: new Date(entity?.endsAt || "").valueOf(),
			professionalId: entity?.professionalId || "",
			serviceId: entity?.serviceId || 0,
		},
	})

	const [professionals, setProfessionals] = useState<SelectValues[]>()
	const [services, setServices] = useState<SelectValues[]>()

	const [profs, setProfs] = useState<Professional[]>()
	const [servs, setServs] = useState<Service[]>()

	const [service, setService] = useState<SelectValues>()
	const [professional, setProfessional] = useState<SelectValues>()

	const setProf = () => {
		profs?.forEach((pfs: Professional) => {
			if (pfs.id == entity?.professionalId)
				setProfessional({
					label: pfs.name,
					value: pfs.id,
				})
		})
	}
	const setServ = () => {
		servs?.forEach((pfs: Service) => {
			if (pfs.id == entity?.serviceId)
				setService({
					label: pfs.name,
					value: pfs.id,
				})
		})
	}
	const getProfessionals = async () => {
		const res = await api.get("/dashboard/professionals")
		const values = await res.data.values?.professionals
		setProfs(values)
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
		const values = await res.data.values?.services
		setServs(values)

		const temp = new Array<SelectValues>()

		values.forEach((pfs: Service) => {
			temp.push({
				label: pfs.name,
				value: pfs.id,
			})
			if (pfs.id == entity?.serviceId)
				setService({
					label: pfs.name,
					value: pfs.id,
				})
		})
		setServices(temp)
	}

	useEffect(() => {
		getProfessionals()
		getServices()
		console.log(entity)
	}, [entity])

	useEffect(() => {
		setServ()
		setProf()
	}, [servs, profs, entity])

	const {
		formState: { errors },
		control,
		setValue,
        getValues,
        reset
	} = formContext

	useEffect(() => {
		console.log(entity)
		if (entity) {
			setValue("startsAt", new Date(entity.startsAt).valueOf())
			setValue("endsAt", new Date(entity.endsAt).valueOf() )
			setValue("professionalId", entity.professionalId)
			setValue("serviceId", entity.serviceId || 0)
		}
	}, [entity])

    useEffect(() => {
        if (!visible) {
            reset()
        }
    },[visible])
	return (
		<Form
			modalTitle="Editar un evento"
			entityName="Evento"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint={`/dashboard/events/${entity?.id || 0}`}
			formContext={formContext as any}
			method="PATCH"
		>
			<>
				<h3> {errors.professionalId && errors.professionalId.message?.toString()}</h3>
				<SuperSelect
					control={control}
					label="Seleccione el profesional"
					name="professionalId"
					options={professionals}
					setValue={setValue}
					getValues={getValues}
					defaultValue={professional}
				/>
				<h3> {errors.serviceId && errors.serviceId.message?.toString()}</h3>
				<SuperSelect
					control={control}
					label="Seleccione el servicio"
					name="serviceId"
					options={services}
					setValue={setValue}
					getValues={getValues}
					defaultValue={service}
				/>
				<h3> {errors.startsAt && errors.startsAt.message?.toString()}</h3>
				<DatetimeSelect
					getValues={getValues}
					control={control}
					setValue={setValue}
					name="startsAt"
					label="Fecha y hora de inicio"
					preDate={new Date(entity?.startsAt || "")}
				/>
				<h3> {errors.endsAt && errors.endsAt.message?.toString()}</h3>
				<DatetimeSelect
					getValues={getValues}
					control={control}
					setValue={setValue}
					name="endsAt"
					label="Fecha y hora de término"
					preDate={new Date(entity?.endsAt || "")}
				/>
			</>
		</Form>
	)
}

export default UpdateEvent
