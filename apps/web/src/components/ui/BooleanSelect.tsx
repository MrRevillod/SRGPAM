import { AnyComponent } from "@fullcalendar/core/preact.js"
import { Radio } from "antd"
import { RadioChangeEvent } from "antd/lib"
import React from "react"
import { UseFormSetValue } from "react-hook-form"

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
export const BooleanSelect: React.FC<Props> = ({ name, defaultValue, options, setValue }) => {
	const handleChange = (ev: RadioChangeEvent) => {
		console.log(ev.target.value)
	}
	return (
		<>
			<Radio.Group onChange={handleChange} defaultValue={defaultValue}>
				{options.map((op) => (
					<Radio.Button value={op.value}>{op.label}</Radio.Button>
				))}
			</Radio.Group>
		</>
	)
}
