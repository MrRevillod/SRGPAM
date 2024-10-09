import React from "react"

const ButtonVariants = {
	primary: "bg-green-700 text-neutral-100",
	secondary: "bg-white border-1 border-red-700 text-red-700",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant: keyof typeof ButtonVariants
	className?: React.ComponentProps<"button">["className"]
	ref?: React.Ref<HTMLButtonElement>
}

export const Button = ({ variant, className, ...props }: ButtonProps) => {
	const classes = `px-4 py-2 rounded-lg font-semibold ${ButtonVariants[variant]} ${className}`
	return <button className={classes} {...props} />
}
