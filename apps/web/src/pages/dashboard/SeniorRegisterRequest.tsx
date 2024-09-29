import React, { useEffect } from "react"
import PageLayout from "../../layouts/PageLayout"

import { es } from "date-fns/locale/es"
import { api } from "../../lib/axios"
import { Input } from "../../components/ui/Input"
import { message, Image } from "antd"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../lib/schemas"
import { useLocation, useNavigate } from "react-router-dom"
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form"

import ReactDatePicker, { registerLocale } from "react-datepicker"

registerLocale("es", es)

import "react-datepicker/dist/react-datepicker.css"

type FormValues = {
	rut: string
	name: string
	email: string
	address: string
	birthDate: Date
}

const SeniorRegisterRequestPage: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const { senior } = location.state || {}

	useEffect(() => {
		if (!senior) {
			navigate("/dashboard/adultos-mayores/nuevos")
		}
	}, [senior])

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(SeniorSchemas.Validate),
		defaultValues: {
			rut: senior.id,
			name: "",
			email: senior.email,
			address: "",
			birthDate: "",
		},
	})

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		console.log("Form Data:", data)
		try {
			await api.patch(`/dashboard/seniors/${senior.id}/new?validate=true`)
			await api.patch(`/dashboard/seniors/${senior.id}`, {
				name: data.name,
				email: data.email,
				address: data.address,
				birthDate: data.birthDate,
				password: "",
				confirmPassword: "",
			})

			message.success("Solicitud aceptada")
			navigate("/dashboard/adultos-mayores/nuevos")
		} catch (error: any) {
			console.error("Error al enviar el formulario:", error.response)
		}
	}

	const onDeny = async () => {
		try {
			await api.patch(`/dashboard/seniors/${senior.id}/new?validate=false`)
			console.log(`Solicitud denegada para el senior con ID: ${senior.id}`)
			navigate("/dashboard/adultos-mayores/nuevos")
			message.success("Solicitud denegada")
		} catch (error) {
			message.error("Error al actualizar la solicitud. Intente nuevamente.")
			console.error("Error al actualizar el usuario:", error)
		}
	}

	return (
		<PageLayout pageTitle="Solicitud de registro de persona mayor">
			<section className="flex flex-row gap-12 items-start w-full h-full">
				<form
					className="flex flex-col gap-4 w-2/5"
					onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
				>
					<Input
						label="Rut (Sin puntos ni guión)"
						type="text"
						placeholder="Rut"
						defaultValue={senior.id}
						{...register("rut")}
						readOnly={true}
						error={errors.rut ? errors.rut.message?.toString() : ""}
					/>
					<Input
						label="Nombre"
						type="text"
						placeholder="Nombre"
						{...register("name")}
						error={errors.name ? errors.name.message?.toString() : ""}
					/>
					<Input
						label="Correo Electrónico"
						type="email"
						placeholder="Email"
						{...register("email")}
						error={errors.email ? errors.email.message?.toString() : ""}
						readOnly={true}
					/>
					<Input
						label="Dirección"
						type="text"
						placeholder="Dirección"
						{...register("address")}
						error={errors.address ? errors.address.message?.toString() : ""}
					/>
					<div className="flex flex-col gap-3 w-full mb-2">
						<div className="flex flex-row gap-2 items-center justify-between">
							<label className="font-semibold">Fecha de Nacimiento</label>
							{errors.birthDate && (
								<div className="text-red-600 text-sm">{errors.birthDate.message?.toString()}</div>
							)}
						</div>
						<Controller
							control={control}
							name="birthDate"
							render={({ field: { onChange, value } }) => (
								<ReactDatePicker
									className="border-1 border-neutral-500 rounded-lg p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full pl-4 placeholder-neutral-400 text-neutral-950 mb-1"
									placeholderText="Fecha de Nacimiento"
									onChange={onChange}
									selected={value as any}
									maxDate={new Date()}
									locale="es"
								/>
							)}
						/>
					</div>

					<div className="flex flex-col gap-8">
						<p>
							<strong>Nota:</strong> Al aceptar esta solicitud, la persona mayor podrá iniciar sesión en
							la aplicación móvil, solicitar servicios y asistir a las horas de atención solicitadas.
						</p>

						<div className="flex gap-4">
							<button key="submit" type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
								Aceptar
							</button>
							<button onClick={() => onDeny()} className="bg-red-500 text-white px-4 py-2 rounded-lg">
								Denegar
							</button>
							<button
								onClick={() => navigate("/dashboard/adultos-mayores/nuevos")}
								className="border-red-500 border-1 text-red-500 px-4 py-2 rounded-lg"
							>
								Cancelar
							</button>
						</div>
					</div>
				</form>

				<div className="h-1/2 w-3/5 grid grid-cols-2 gap-2">
					<div className="col-span-1 grid grid-rows-2">
						<div className="row-span-1 h-1/2 rounded-lg">
							<Image
								src="/img/frontal.jpg"
								width="240"
								height="152"
								alt="Cédula Frontal"
								style={{ objectFit: "cover" }}
							/>
						</div>
						<div className="row-span-1 h-1/2 rounded-lg">
							<Image
								src="/img/reverso.jpg"
								width="240"
								height="152"
								alt="Cédula Reverso"
								style={{ objectFit: "cover" }}
							/>
						</div>
					</div>
					<div className="col-span-1">
						<Image
							src="/img/rsh.png"
							width="575"
							height="800"
							alt="Cartola Hogar"
							style={{ objectFit: "cover" }}
						/>
					</div>
				</div>
			</section>
		</PageLayout>
	)
}

export default SeniorRegisterRequestPage
