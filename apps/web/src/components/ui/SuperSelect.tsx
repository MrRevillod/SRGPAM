import clsx from "clsx"
import React from "react"

import { Select } from "antd"
import { Controller, set, useFormContext } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"

interface SuperSelectProps {
	name: string
	label: string
	options: any
	defaultValue?: any
	setSearch?: Dispatch<SetStateAction<string>>
}

export const SuperSelect = ({ name, label, options, defaultValue, setSearch }: SuperSelectProps) => {
	const {
		formState: { errors },
		control,
	} = useFormContext()

	const classes = clsx(
		errors[name] ? "border-red" : "border-gray-dark",
		"rounded-lg text-sm focus:outline-none focus:ring-primary-green",
		"focus:border-primary-green w-full h-10 placeholder-neutral-400",
		"text-dark dark:text-light mb-1 border-1 bg-light dark:bg-primary-dark",
	)

	const clientFilterFn = (input: string, option: any) => {
		return (option?.label as string).toLowerCase().includes(input.toLowerCase())
	}

	const filterOption = setSearch ? false : clientFilterFn

	return (
		<>
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{errors[name] && <div className="text-red text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<Controller
				control={control}
				name={name}
				defaultValue={defaultValue}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value}
						className={classes}
						showSearch
						placeholder={"Selecciona una opcion"}
						options={options}
						filterOption={filterOption}
						onSearch={(value) => {
							setSearch && setSearch(value)
						}}
						onChange={(value) => {
							field.onChange(value)
						}}
					/>
				)}
			/>
		</>
	)
}
