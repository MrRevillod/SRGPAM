import React from "react"
import { FileInput } from "flowbite-react"
import { useFormContext } from "react-hook-form"

interface InputFileProps {
	label: string
	name: string
}

export const InputFile: React.FC<InputFileProps> = ({ label, name }) => {
	const {
		register,
		formState: { errors },
	} = useFormContext()

	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{errors[name] && <div className="text-red-600 text-sm">{errors[name]?.message?.toString()}</div>}
			</div>
			<FileInput
				accept="image/jpeg,image/png,image/jpg,image/webp"
				className={`${errors[name] ? "border-red-400" : "border-neutral-500"} rounded-lg border-1`}
				{...register(name)}
			/>
		</div>
	)
}
