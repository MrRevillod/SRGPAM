import React, { useEffect, useState } from "react"
import { Control, Controller, FieldValues, UseFormSetValue } from "react-hook-form"
import Datetime from "react-datetime"

export const DatetimeSelect = ({
	control,
	name,
	label,
	setValue,
	getValues,
	preDate,
	setDate,
}: {
	control: Control<any>
	name: string
	label: string
	setValue: UseFormSetValue<any>
	getValues: any
	preDate?: Date
	setDate?: React.Dispatch<React.SetStateAction<Date|undefined>>
}) => {
	const [valor, setValor] = useState<any>("")
	const [initDate, setInitDate] = useState<Date>(preDate || new Date())

    useEffect(() => {
        if (getValues(name) === undefined) {
            console.log("xd")
			setValor("")
        }
        
	}, [getValues(name)])

    useEffect(() => {
        if (preDate) {
            setValor(
                new Date(preDate.valueOf()).toLocaleDateString() +
                "   " +
                new Date(preDate.valueOf()).toLocaleTimeString(),
            )
            setValue(name, preDate.valueOf())
            setInitDate(preDate)
        }
        
    }, [preDate])
    
	const renderInput = (props: any, openCalendar: any, closeCalendar: any) => {
		return <input {...props} value={valor} readOnly={true} />
	}
	return (
		<>
			<label htmlFor={name} className="font-semibold text-neutral-950">
				{label}
			</label>

			<Datetime
				onChange={(value) => {
					setValor(
						new Date(value.valueOf()).toLocaleDateString() +
							"   " +
							new Date(value.valueOf()).toLocaleTimeString(),
					)
					setValue(name, value.valueOf())
				}}
				initialViewMode={"time"}
				initialViewDate={initDate}
				renderInput={renderInput}
				className="datetime-select"
				closeOnClickOutside={true}
				closeOnSelect={true}
				onClose={(props) => {
					if (!props) {
						setValor(initDate.toLocaleDateString() + "   " + initDate.toLocaleTimeString())
						setValue(name, initDate.valueOf())
					}
				}}
				inputProps={{
					className: "input-date",
				}}
			/>
		</>
	)
}
