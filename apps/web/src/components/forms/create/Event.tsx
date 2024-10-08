import React, { useEffect, useState } from "react"
import Form from "../Form"
import "react-datetime/css/react-datetime.css"
import { EventSchemas } from "../../../lib/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateEntityFormProps, Event, Professional, Service } from "../../../lib/types"
import { DatetimeSelect } from "../../ui/DatetimeSelect"
import { api } from "../../../lib/axios"
import { SuperSelect } from "../../ui/SuperSelect"

type SelectValues = {
    value: string | number
    label: string
}
const CreateEvent: React.FC<CreateEntityFormProps<Event>> = ({ visible, onCancel, onOk, data, setData }) => {

    const formContext = useForm({
        resolver: zodResolver(EventSchemas.Create), defaultValues: {
            startsAt: undefined,
            endsAt: undefined,
            professionalId: undefined,
            serviceId: undefined
        }
    })

    const [professionals, setProfessionals] = useState<SelectValues[]>()
    const [services, setServices] = useState<SelectValues[]>()
    const [date,setDate] = useState<Date>()
    
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

    const {
        formState: { errors },
        control,
        setValue,
        getValues


    } = formContext

    return (
        <Form
            modalTitle="Crear un nuevo evento"
            entityName="Evento"
            onOk={onOk}
            data={data}
            setData={setData}
            visible={visible}
            onCancel={onCancel}
            apiEndpoint="/dashboard/events/"
            formContext={formContext as any}
            method="POST"
        >
            <h3> {errors.professionalId && errors.professionalId.message?.toString()}</h3>
            <SuperSelect
                control={control}
                label="Seleccione el profesional"
                name="professionalId"
                options={professionals}
                setValue={setValue}
                getValues={getValues}
            />
            <h3> {errors.serviceId && errors.serviceId.message?.toString()}</h3>

            <SuperSelect
                control={control}
                label="Seleccione el servicio"
                name="serviceId"
                options={services}
                setValue={setValue}
                getValues={getValues}
            />
            <h3> {errors.startsAt && errors.startsAt.message?.toString()}</h3>
            <DatetimeSelect
                getValues={getValues}
                control={control}
                setValue={setValue}
                name="startsAt"
                label="Fecha y hora de inicio"
                setDate={setDate}
            />

            <h3> {errors.endsAt && errors.endsAt.message?.toString()}</h3>
            <DatetimeSelect
                getValues={getValues}
                control={control}
                setValue={setValue}
                name="endsAt"
                label="Fecha y hora de término"
                preDate={date}
            />
        </Form>
    )
}

export default CreateEvent
