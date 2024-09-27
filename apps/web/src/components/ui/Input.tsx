import React, { useState, forwardRef } from "react"
import { Link } from "react-router-dom"
import { Show } from "./Show"
import { FieldError } from "react-hook-form"

type InputType = "text" | "password" | "email" | "number" | "select"

interface InputProps {
	label: string
	type: InputType
	placeholder?: string
	error?: string | FieldError
	name: string
	islogin?: string | boolean
	value?: string | number
	defaultValue?: string | number
	options?: { value: string; label: string }[]
}

export const Input = forwardRef<HTMLInputElement | HTMLSelectElement, InputProps>((props, ref) => {
	const { label, type, placeholder, error, name, islogin = false, defaultValue, options } = props

	const classes = `border-1 ${error ? "border-red-400" : "border-neutral-500"} rounded-lg 
        p-2 focus:outline-none  focus:ring-blue-500 focus:border-blue-500 w-full 
        pl-4 placeholder-neutral-400 text-neutral-950 mb-1
    `

	const [inputType, setInputType] = useState<InputType>(type)

	return (
		<div className="flex flex-col gap-3 w-full">
			<Show when={label === "Contraseña" && type === "password"}>
				<div className="flex justify-between w-full items-center mt-2">
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
					{error && <div className="text-red-600 text-sm">{error.toString()}</div>}
				</div>
			</Show>

			<div className="relative flex flex-row justify-center">
				{type === "select" ? (
					<select
						ref={ref as React.Ref<HTMLSelectElement>}
						className={classes}
						{...props}
						defaultValue={defaultValue}
					>
						<option value="">Seleccione una opción</option>
						{options?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				) : (
					<input
						ref={ref as React.Ref<HTMLInputElement>}
						className={classes}
						placeholder={placeholder}
						{...props}
						type={inputType}
						defaultValue={defaultValue}
					/>
				)}
			</div>
		</div>
	)
})

Input.displayName = "Input"
