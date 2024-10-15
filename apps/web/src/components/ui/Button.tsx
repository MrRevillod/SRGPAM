import React from "react"

type ButtonVariant = "primary" | "secondary" | "delete" | "deny"

const ButtonVariants: Record<ButtonVariant, string> = {
	primary: "bg-primary text-neutral-100",
	secondary:
		"bg-light dark:bg-primary-dark border-1 border-gray-dark dark:border-gray-medium text-dark dark:text-gray-light",
	delete: "bg-red border-none text-neutral-100",
	deny: "bg-red border-none text-neutral-100",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant: ButtonVariant
	className?: string
	ref?: React.Ref<HTMLButtonElement>
}

export const Button: React.FC<ButtonProps> = ({ variant, className = "", ...props }) => {
	const classes = `px-4 py-2 rounded-lg font-semibold ${ButtonVariants[variant]} ${className}`
	return <button className={classes} {...props} />
}
