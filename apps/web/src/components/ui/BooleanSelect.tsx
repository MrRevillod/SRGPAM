import React from "react"
import { Radio } from "antd"
import { Controller, useFormContext, UseFormSetValue } from "react-hook-form"

type Opt = {
	value: Boolean
	label: String
}

type Props = {
	name: string
	defaultValue: Boolean
	options: Array<Opt>
	setValue: UseFormSetValue<any>
}

export const BooleanSelect: React.FC<Props> = ({ defaultValue, options, name }) => {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			defaultValue={defaultValue}
			render={() => (
				<Radio.Group defaultValue={defaultValue} onChange={(ev) => ev.target.value}>
					{options.map((op, index) => (
						<Radio.Button key={index} value={op.value}>
							{op.label}
						</Radio.Button>
					))}
				</Radio.Group>
			)}
		></Controller>
	)
}
