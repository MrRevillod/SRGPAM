import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Show } from "./Show"
import { useFormContext } from "react-hook-form"

type InputType = "text" | "password" | "email" | "number" | "select" | "file"

interface InputProps {
	label: string
	type: InputType
	placeholder?: string
	name: string
	islogin?: string | boolean
	options?: { value: string; label: string }[]
	defaultValue?: string
	readOnly?: boolean
}

export const Input: React.FC<InputProps> = (props) => {
	const { label, type, placeholder, name, islogin = false, options, defaultValue, readOnly } = props

	const {
		register,
		formState: { errors },
	} = useFormContext()

	const classes = `border-1 ${errors[name] ? "border-red-400" : "border-neutral-500"} rounded-lg 
        p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full 
        pl-4 placeholder-neutral-400 text-neutral-950 mb-1
    `

	const [inputType, setInputType] = useState<InputType>(type)

	return (
		<div className="flex flex-col gap-3 w-full">
			<Show when={label === "Contraseña" && type === "password"}>
				<div className="flex justify-between w-full items-center">
					<label htmlFor={name} className="font-semibold text-neutral-950">
						{label}
					</label>

					<Show when={islogin === "true"}>
						<Link
							to="/auth/reset-password"
							className="text-neutral-950 text-sm hover:underline hover:text-blue-500"
						>
							¿Olvidaste tu contraseña?
						</Link>
					</Show>
				</div>
			</Show>

			<Show when={label !== "Contraseña" || type !== "password" || !islogin}>
				<div className="flex flex-row gap-2 items-center justify-between">
					<label className="font-semibold">{label}</label>
					{errors[name] && <div className="text-red-600 text-sm">{errors[name]?.message?.toString()}</div>}
				</div>
			</Show>

			<div className="relative flex flex-row justify-center">
				{type === "select" ? (
					<select className={classes} {...register(name)} defaultValue={defaultValue || ""}>
						<option value="">Seleccione una opción</option>
						{options?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				) : (
					<input
						className={classes}
						placeholder={placeholder}
						{...register(name)}
						type={inputType}
						readOnly={readOnly ? true : false}
					/>
				)}
			</div>
		</div>
	)
}
