import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Input } from "../../components/ui/Input"
import { FormProvider, useForm } from "react-hook-form"
import { api } from "../../lib/axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { getValidationSchema } from "../../lib/schemas"
import { message } from "antd"
import { Helmet } from "react-helmet"
import { jwtDecode } from "jwt-decode"

const ValidatePasswordPage: React.FC = () => {
	const { id, token, role } = useParams()

	if (!id || !role || !token) throw new Error()

	const payload = jwtDecode(role) as { role: string }

	const formSchemas = getValidationSchema(payload.role)

	const methods = useForm({
		resolver: zodResolver(formSchemas),
	})

	const { handleSubmit, reset } = methods

	const onSubmit = async (data: any) => {
		try {
			const response = await api.post(`/reset-password/${id}/${token}/${role}`, {
				password: data.password,
			})

			message.success(response.data.message)
			reset()
		} catch (error: any) {
			message.error(error.response.data.message || "Error inesperado.")
		}
	}

	return (
		<FormProvider {...methods}>
			<Helmet>
				<title>Restablecer contraseña - Dirección de personas mayores de la municipalidad de Temuco</title>
			</Helmet>

			<div className="flex w-full login-container items-center justify-center absolute">
				<div className="bg-white flex flex-col justify-center items-center px-12 w-11/12 md:w-1/2 lg:w-1/3 xl:w-5/12 2xl:w-1/4 rounded-lg h-4/6 login-form-container">
					<div className="w-full max-w-md">
						<h2 className="text-4xl font-bold text-gray-900 text-center mb-8">Restablecer Contraseña</h2>
						<p className="text-center text-gray-600 mb-6">Ingresa y confirma tu nueva contraseña.</p>

						<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
							<Input
								label="Nueva Contraseña"
								type="password"
								name="password"
								placeholder="Ingresa tu nueva contraseña"
							/>

							<Input
								label="Confirmar Contraseña"
								type="password"
								name="confirmPassword"
								placeholder="Confirma tu nueva contraseña"
							/>

							<div className="mt-4">
								<button
									type="submit"
									className="bg-green-800 text-neutral-100 rounded-lg p-2 w-full h-12 font-bold"
								>
									Restablecer Contraseña
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</FormProvider>
	)
}
export default ValidatePasswordPage
