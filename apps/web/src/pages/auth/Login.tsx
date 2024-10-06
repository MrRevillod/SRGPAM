import React from "react"
import { Input } from "../../components/ui/Input"
import { useAuth } from "../../context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFormData } from "../../lib/types"
import { LoginFormSchema } from "../../lib/schemas"
import { SubmitHandler, useForm } from "react-hook-form"

const LoginPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(LoginFormSchema),
	})

	const { login, error, role,isAuthenticated } = useAuth()

	const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
		await login(formData)
		if (isAuthenticated) {
			const roles = {
				ADMIN: "Administrador",
				PROFESSIONAL: "Profesional",
			}

			localStorage.setItem("SELECTED_ROLE", roles[formData.role])
		}
		return
	}
	return (
		<div className="flex w-full login-container items-center justify-center absolute">
			<div className="bg-white flex flex-col justify-center items-center px-12 w-11/12 md:w-1/2 lg:w-1/3 xl:w-5/12 2xl:w-1/4 rounded-lg h-4/6 login-form-container">
				<div className="w-full max-w-md">
					<h2 className="text-4xl font-bold text-gray-900 text-center mb-4">¡Hola!</h2>
					<p className="text-center text-gray-600 mb-6">
						Dirección de adultos mayores de la municipalidad de Temuco.
					</p>

					{error && <p className="text-red-600 text-center mb-4">{error}</p>}

					<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit as any)}>
						<Input
							label="Correo electrónico"
							type="email"
							defaultValue={"ccormier-kihn@admins.com"}
							{...register("email")}
							placeholder="example@gmail.com"
							error={errors.email ? errors.email.message?.toString() : ""}
						/>

						<Input
							label="Contraseña"
							type="password"
							defaultValue={"!Admin2024Password"}
							{...register("password")}
							placeholder="●●●●●●●●●●"
							error={errors.password ? errors.password.message?.toString() : ""}
							islogin="true"
						/>

						<Input
							label="Ocupación"
							type="select"
							{...register("role")}
							options={[
								{ value: "ADMIN", label: "Administrador" },
								{ value: "PROFESSIONAL", label: "Profesional" },
							]}
							defaultValue={role || "ADMIN"}
							error={errors.role ? errors.role.message?.toString() : ""}
						/>

						<div className="mt-4">
							<button
								type="submit"
								className="bg-green-800 text-neutral-100 rounded-lg p-2  w-full h-12 font-bold"
							>
								Iniciar sesión
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
