import clsx from "clsx"
import React, { useEffect } from "react"

import { Select } from "antd"
import { useModal } from "../../context/ModalContext"
import { Dispatch, SetStateAction } from "react"
import { Controller, useFormContext } from "react-hook-form"

interface SuperSelectProps {
	name: string
	label: string
	options: any
	defaultValue?: any
	setSearch?: Dispatch<SetStateAction<string>>
}

export const SuperSelect = ({ name, label, options, defaultValue, setSearch }: SuperSelectProps) => {
	const {
		reset,
		control,
		setValue,
		formState: { errors },
	} = useFormContext()

	const classes = clsx(
		errors[name] ? "border-red" : "border-gray-dark",
		"rounded-lg text-sm focus:outline-none focus:ring-primary-green",
		"focus:border-primary-green w-full h-10 placeholder-neutral-400",
		"text-dark dark:text-light mb-1 border-1 bg-light dark:bg-primary-dark",
	)

	const { isModalOpen } = useModal()

	const clientFilterFn = (input: string, option: any) => {
		return (option?.label as string).toLowerCase().includes(input.toLowerCase())
	}

	const filterOption = setSearch ? false : clientFilterFn

	useEffect(() => {
		if (!defaultValue) {
			setValue(name, undefined)
		} else {
			setValue(name, defaultValue)
		}
	}, [defaultValue, name])

	useEffect(() => {
		if (isModalOpen) reset()
	}, [isModalOpen])

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
