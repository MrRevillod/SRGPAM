import React, { forwardRef } from "react"
import { FileInput } from "flowbite-react"

interface InputFileProps {
	label: string
	error?: string
}

const InputFile: React.FC<InputFileProps> = forwardRef<HTMLInputElement, InputFileProps>((props, ref) => {
	const { label, error } = props

	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{error && <div className="text-red-600 text-sm">{error}</div>}
			</div>
			<FileInput
				ref={ref}
				accept="image/jpeg,image/png,image/jpg,image/webp"
				className={`${error ? "border-red-400" : "border-neutral-500"} rounded-lg border-1`}
				{...props}
			/>
		</div>
	)
})

InputFile.displayName = "InputFile"

export default InputFile
