import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Show } from "./Show"
import { useFormContext } from "react-hook-form"
import { AiFillEye } from "react-icons/ai"

type InputType = "text" | "password" | "email" | "number" | "select"

interface InputProps {
	label: string
	type: InputType
	placeholder?: string
	name: string
	login?: boolean
	defaultValue?: string
	readOnly?: boolean
	options?: { value: string; label: string }[]
}

const InputLabel: React.FC<{ label: string }> = ({ label }) => {
	return <label className="font-semibold text-neutral-950">{label}</label>
}

export const Input: React.FC<InputProps> = (props) => {
	const { label, type, placeholder, name, login = false, options, defaultValue, readOnly } = props

	const {
		register,
		formState: { errors },
	} = useFormContext()

	const [showPassword, setShowPassword] = useState(false)

	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const classes = `border-1 ${errors[name] ? "border-red-400" : "border-neutral-500"} rounded-lg 
        p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full 
        pl-4 placeholder-neutral-400 text-neutral-950 mb-1
    `

	return (
		<div className="flex flex-col gap-3 w-full">
			<Show when={type === "password" && login}>
				<div className="flex justify-between w-full items-center">
					<InputLabel label={label} />
					<Link
						to="/auth/reset-password"
						className="text-neutral-950 text-sm hover:underline hover:text-blue-500"
					>
						¿Olvidaste tu contraseña?
					</Link>
				</div>
			</Show>

			<Show when={!login}>
				<div className="flex flex-row gap-2 items-center justify-between">
					<InputLabel label={label} />
					{errors[name] && <div className="text-red-600 text-sm">{errors[name]?.message?.toString()}</div>}
				</div>
			</Show>

			<div className="relative flex flex-row justify-center">
				<Show when={type === "select"}>
					<select className={classes} {...register(name)} defaultValue={defaultValue || ""}>
						<option value="">Seleccione una opción</option>
						{options?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</Show>

				<Show when={type !== "select"}>
					<div className="relative w-full">
						<input
							className={classes}
							placeholder={placeholder}
							{...register(name)}
							type={showPassword && type === "password" ? "text" : type}
							readOnly={readOnly ? true : false}
						/>
						<Show when={type === "password"}>
							<button
								type="button"
								onClick={handleTogglePasswordVisibility}
								className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-neutral-600 hover:text-blue-500"
							>
								<AiFillEye className="text-neutral-600 text-xl mr-1" />
							</button>
						</Show>
					</div>
				</Show>
			</div>
		</div>
	)
}
