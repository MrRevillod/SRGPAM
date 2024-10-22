import React from "react"
import { Radio } from "antd"
import { Controller, useFormContext } from "react-hook-form"

type Opt = {
	value: Boolean
	label: String
}

type Props = {
	name: string
	defaultValue: Boolean
	options: Array<Opt>
}

export const BooleanSelect: React.FC<Props> = ({ name, defaultValue, options }) => {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			defaultValue={defaultValue}
			render={({ field }) => (
				<Radio.Group
					value={field.value}
					defaultValue={defaultValue}
					onChange={(ev) => field.onChange(ev.target.value)}
				>
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
