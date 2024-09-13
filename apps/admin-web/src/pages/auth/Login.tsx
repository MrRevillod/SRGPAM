import React from "react"
import axios from "axios"

import { z } from "zod"
import { Input } from "../../components/ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

const LoginPage: React.FC = () => {
	type FormData = {
		email: string
		password: string
		role: "ADMIN" | "PROFESSIONAL"
	}

	const schema = z.object({
		email: z.string().email().min(1, "El correo eléctronico es requerido"),
		password: z.string().min(1, "La contraseña es requerida"),
		role: z.enum(["ADMIN", "PROFESSIONAL"]),
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	})

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		try {
			const response = await axios.post(`http://localhost/api/auth/login?variant=${data.role}`, data)
			console.log(response)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="-mt-8 w-4/6 lg:w-3/6 2xl:w-2/6 h-3/4 form">
			<div className="flex flex-col items-center gap-2">
				<h2 className="text-4xl font-bold text-primary text-center">Iniciar sesión</h2>
				<p className="text-center font-normal text-neutral-900 text-sm">
					Ingresa al sistema de reservas y gestión de servicios para adultos mayores
				</p>
			</div>

			<form className="w-11/12 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit as any)}>
				<Input
					label="Email"
					type="email"
					{...register("email")}
					placeholder="john@domain.com"
					error={errors.email ? errors.email.message?.toString() : ""}
				/>

				<Input
					label="Password"
					type="password"
					{...register("password")}
					placeholder="●●●●●●●●●●"
					error={errors.password ? errors.password.message?.toString() : ""}
					islogin="true"
				/>

				<Input
					label="Role"
					type="select"
					{...register("role")}
					options={[
						{ value: "ADMIN", label: "Administrador" },
						{ value: "PROFESSIONAL", label: "Profesional" },
					]}
					defaultValue="ADMIN"
					error={errors.role ? errors.role.message?.toString() : ""}
				/>

				<button type="submit" className="bg-green-800 text-neutral-100 rounded-lg p-2 h-11 font-bold mt-4">
					Login
				</button>
			</form>
		</div>
	)
}

export default LoginPage
