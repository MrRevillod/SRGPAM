import React from "react"

import { Controller } from "react-hook-form"
import { useFormContext } from "react-hook-form"
import { ColorPicker as AntDColorPicker } from "antd"

interface ColorPickerProps {
	label: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label }) => {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name="color"
			render={({ field }) => (
				<div className="flex flex-row gap-2 w-full items-center justify-between">
					<div className="flex flex-col gap-2 w-4/5">
						<label className="font-semibold text-dark dark:text-light text-sm">{label}</label>
						<p>Selecciona un color para representar el servicio</p>
					</div>
					<AntDColorPicker
						className="w-1/8 p-2 h-full"
						value={field.value}
						onChange={(color) => field.onChange(`#${color.toHex()}`)}
					/>
				</div>
			)}
		/>
	)
}
