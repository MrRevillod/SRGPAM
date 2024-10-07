import React from "react"
import ReactDatePicker from "react-datepicker"

import { es } from "date-fns/locale/es"
import { registerLocale } from "react-datepicker"
import { Controller, useFormContext } from "react-hook-form"

registerLocale("es", es)

import "react-datepicker/dist/react-datepicker.css"

interface DatePickerProps {
	label: string
	name: string
}

export const DatePicker: React.FC<DatePickerProps> = ({ name, label }) => {
	const {
		control,
		formState: { errors },
	} = useFormContext()

	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{errors[name] && <div className="text-red-600 text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => (
					<ReactDatePicker
						className="border-1 border-neutral-500 rounded-lg p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full pl-4 placeholder-neutral-400 text-neutral-950 mb-1"
						placeholderText="Selecciona una fecha"
						onChange={onChange}
						selected={value as any}
						maxDate={new Date()}
						locale="es"
					/>
				)}
			/>
		</div>
	)
}
