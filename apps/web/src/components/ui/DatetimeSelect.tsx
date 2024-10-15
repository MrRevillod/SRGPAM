import React, { useEffect, useState } from "react"
import { ConfigProvider, DatePicker, Space } from "antd"
import { Controller, useFormContext } from "react-hook-form"
import { useModal } from "../../context/ModalContext"
import dayjs, { Dayjs } from "dayjs"
import locale from "antd/locale/es_ES"

const DatetimeSelect = ({ label, name, defaultValue }: { label: string; name: string; defaultValue?: Dayjs }) => {
	const {
		setValue,
		formState: { errors },
		control,
		getValues,
		watch, // Permite observar cambios en los valores
	} = useFormContext()

	const [date, setDate] = useState<Dayjs | null>(defaultValue || null)
	const { isModalOpen } = useModal()

	// Observar el valor de startsAt
	const startsAtValue = watch("startsAt")

	useEffect(() => {
		// Actualiza el valor del campo cuando cambia el defaultValue
		if (defaultValue) {
			setValue(name, defaultValue.valueOf())
			setDate(defaultValue)
		} else if (name === "endsAt" && !getValues(name) && startsAtValue) {
			// Auto rellena endsAt cuando startsAt tiene un valor y endsAt está vacío
			setValue(name, startsAtValue)
			setDate(dayjs(startsAtValue))
		}
	}, [defaultValue, name, setValue, getValues, startsAtValue])

	useEffect(() => {
		if (!isModalOpen) {
			setDate(null)
		}
	}, [isModalOpen])

	return (
		<Space direction="vertical" size={12}>
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{errors[name] && <div className="text-red-600 text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<ConfigProvider locale={locale}>
						<DatePicker
							{...field}
							showTime
							value={date} // El valor que manejamos en el estado
							defaultValue={defaultValue} // Solo inicializa el valor, pero luego depende de `value`
							onChange={(value) => {
								setValue(name, value?.valueOf()) // Guarda el valor como timestamp
								setDate(value) // Actualiza el estado local
							}}
						/>
					</ConfigProvider>
				)}
			/>
		</Space>
	)
}

export default DatetimeSelect
