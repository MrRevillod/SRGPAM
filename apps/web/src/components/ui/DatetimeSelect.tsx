import React, { useEffect, useState } from "react"
import { ConfigProvider, DatePicker, Space } from "antd"
import { Controller, useFormContext } from "react-hook-form"
import { useModal } from "../../context/ModalContext"
import dayjs, { Dayjs } from "dayjs"
const { RangePicker } = DatePicker

const DatetimeSelect = ({ label, name, defaultValue }: { label: string; name: string; defaultValue?: Dayjs }) => {
	const {
		setValue,
		formState: { errors },
		control,
	} = useFormContext()

	const [date, setDate] = useState<Dayjs | null>(defaultValue || null)

	const { isModalOpen } = useModal()

    useEffect(() => {
		// Actualiza el valor del campo cuando cambia el defaultValue
		if (defaultValue) {
			setValue(name, defaultValue.valueOf())
			setDate(defaultValue)
		}
	}, [defaultValue, name, setValue])

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
				)}
			/>
		</Space>
	)
}

export default DatetimeSelect
