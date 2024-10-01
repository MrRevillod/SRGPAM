import React from "react"
import ReactDatePicker from "react-datepicker"

import { es } from "date-fns/locale/es"
import { registerLocale } from "react-datepicker"
import { Control, Controller } from "react-hook-form"

registerLocale("es", es)

import "react-datepicker/dist/react-datepicker.css"

interface DatePickerProps {
	label: string
	name: string
	control: Control
	error?: string
}

const DatePicker: React.FC<DatePickerProps> = ({ name, label, control, error }) => {
	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{error && <div className="text-red-600 text-sm">{error}</div>}
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

export default DatePicker
