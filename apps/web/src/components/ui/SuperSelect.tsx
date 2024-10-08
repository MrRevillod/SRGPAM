import React, { useEffect, useState } from "react"
import { Control, UseFormSetValue } from "react-hook-form"
import Select from "react-select"

export const SuperSelect = ({
	control,
	name,
	label,
	options,
	setValue,
	getValues,
	defaultValue,
}: {
	control: Control<any>
	name: string
	label: string
	options: any
	setValue: UseFormSetValue<any>
	getValues: any
	defaultValue?: any
}) => {
	// Usa defaultValue como valor inicial, si está definido
	const [valor, setValor] = useState<any>(defaultValue || null)

	useEffect(() => {
		// Si defaultValue cambia, actualiza el valor del select
		if (defaultValue) {
			setValor(defaultValue)
		}
	}, [defaultValue])

	useEffect(() => {
		// Verificar si getValues tiene el valor actual
		if (getValues(name) === undefined) {
			setValor("")
		}
	}, [getValues, name])

	return (
		<>
			<label htmlFor={name} className="font-semibold text-neutral-950">
				{label}
			</label>

			<Select
				id="myvalue"
				options={options}
				value={valor}
				onChange={(value) => {
					setValor(value) // Actualizar el estado local
					setValue(name, value?.value) // Actualizar el valor en el formulario de React Hook Form
				}}
			/>
		</>
	)
}
