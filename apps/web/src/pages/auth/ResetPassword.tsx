import React from "react"
import { Input } from "../../components/ui/Input"
import { useForm } from "react-hook-form"
import { api } from "../../lib/axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { message } from "antd"

const ResetPasswordPage: React.FC = () => {
	const formSchemas = z.object({
		email: z.string().email({
			message: "Correo electrónico inválido",
		}),
		role: z.enum(["ADMIN", "PROFESSIONAL", "SENIOR"]),
	})
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ resolver: zodResolver(formSchemas) })

	const onSubmit = async (data: any) => {
		try {
			const response = await api.post(`/dashboard/mailer/reset-password?variant=${data.role}`, {
				email: data.email,
			})

			message.success(response.data.message)

			reset()
		} catch (error: any) {
			message.error(error.response.data.message || "Error inesperado.")
		}
	}

	return (
		<div className="flex w-full login-container items-center justify-center absolute">
			<div className="bg-white flex flex-col justify-center items-center px-12 w-11/12 md:w-1/2 lg:w-1/3 xl:w-5/12 2xl:w-1/4 rounded-lg h-4/6 login-form-container">
				<div className="w-full max-w-md">
					<h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Restablecer Contraseña</h2>
					<p className="text-center text-gray-600 mb-6">
						Por favor, ingresa tu correo electrónico y selecciona tu rol para continuar.
					</p>

					<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
						<Input
							label="Correo electrónico"
							type="email"
							{...register("email", { required: "Este campo es requerido" })}
							placeholder="example@gmail.com"
							error={errors.email ? errors.email.message?.toString() : ""}
						/>

						<Input
							label="Ocupación"
							type="select"
							{...register("role", { required: "Este campo es requerido" })}
							options={[
								{ value: "ADMIN", label: "Administrador" },
								{ value: "PROFESSIONAL", label: "Profesional" },
								{ value: "SENIOR", label: "Persona Mayor" },
							]}
							defaultValue="SENIOR"
							error={errors.role ? errors.role.message?.toString() : ""}
						/>

						<div className="mt-4">
							<button
								type="submit"
								className="bg-green-800 text-neutral-100 rounded-lg p-2 w-full h-12 font-bold"
							>
								Enviar enlace
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default ResetPasswordPage
