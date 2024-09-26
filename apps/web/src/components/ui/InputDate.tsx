import React from "react"
import { Show } from "./Show"

export const InputDate = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
>(({ label, error, defaultValue, ...props }, ref) => {
	const classes = `border-1 ${error ? "border-red-400" : "border-neutral-500"} rounded-lg 
        p-2 focus:outline-none  focus:ring-blue-500 focus:border-blue-500 w-full 
        pl-4 placeholder-neutral-400 text-neutral-950 mb-1
    `

	const formattedDate = (value: string | undefined): string | undefined => {
		if (!value) return undefined
		const date = new Date(value)
		if (isNaN(date.getTime())) {
			return undefined
		}
		return date.toISOString().split("T")[0]
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-2 items-center justify-between">
				<label className="font-semibold">{label}</label>
				{error && <div className="text-red-600 text-sm">{error.toString()}</div>}
			</div>

			<Show when={defaultValue !== undefined}>
				<input
					type="date"
					defaultValue={formattedDate(defaultValue as any)}
					className={classes}
					{...props}
					ref={ref}
				/>
			</Show>

			<Show when={defaultValue === undefined}>
				<input type="date" className={classes} {...props} ref={ref} />
			</Show>
		</div>
	)
})

InputDate.displayName = "InputDate"
