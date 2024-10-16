import React from "react"
import { Radio } from "antd"
import { UseFormSetValue } from "react-hook-form"
import { RadioChangeEvent } from "antd/lib"

type Opt = {
	value: Boolean
	label: String
}

type Props = {
	name: String
	defaultValue: Boolean
	options: Array<Opt>
	setValue: UseFormSetValue<any>
}

export const BooleanSelect: React.FC<Props> = ({ defaultValue, options }) => {
	const handleChange = (ev: RadioChangeEvent) => {
		console.log(ev.target.value)
	}

	return (
		<Radio.Group onChange={handleChange} defaultValue={defaultValue}>
			{options.map((op, index) => (
				<Radio.Button key={index} value={op.value}>
					{op.label}
				</Radio.Button>
			))}
		</Radio.Group>
	)
}
