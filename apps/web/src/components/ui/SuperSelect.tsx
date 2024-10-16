import { Select } from "antd/lib"
import React, { useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useModal } from "../../context/ModalContext"

export const SuperSelect = ({
	name,
	label,
	options,
	defaultValue,
}: {
	name: string
	label: string
	options: any
	defaultValue?: any
}) => {
	const {
		setValue,
		formState: { errors },
		control,
		reset,
	} = useFormContext()

	const { isModalOpen } = useModal()
	useEffect(() => {
		if (!defaultValue) {
			setValue(name, undefined) // Actualiza el valor del campo cuando cambia el defaultValue
		} else {
			setValue(name, defaultValue) // Actualiza el valor del campo cuando cambia el defaultValue
		}
	}, [defaultValue, name])

	useEffect(() => {
		if (!isModalOpen) {
			reset()
		}
	}, [isModalOpen])

	return (
		<>
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{errors[name] && <div className="text-red-600 text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<Controller
				control={control}
				name={name}
				defaultValue={defaultValue}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value} // Usa "value" en lugar de "defaultValue"
						showSearch
						placeholder={"Selecciona una opcion"}
						options={options} // Agrega las opciones pasadas como prop
						filterOption={(input, option) =>
							((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())
						}
						onChange={(value) => field.onChange(value)} // Controla el cambio del valor
					/>
				)}
			/>
		</>
	)
}
