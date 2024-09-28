import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { Input } from "../../components/ui/Input"
import { Image } from "antd"
import PageLayout from "../../layouts/PageLayout"
import ReactDatePicker from "react-datepicker"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../lib/schemas"
import { api } from "../../lib/axios"

const SeniorRegisterRequestPage: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { senior } = location.state || {}

	useEffect(() => {
		if (!senior) {
			navigate("/dashboard/adultos-mayores/nuevos")
		}
	}, [senior, navigate])

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm({
		resolver: zodResolver(SeniorSchemas.Update),
	})

	const handleValidate = async (validate: boolean) => {
		if (senior && senior.id) {
			try {
				await api.patch(`/dashboard/seniors/${senior.id}/new?validate=${validate}`)

				console.log(`Solicitud ${validate ? "aceptada" : "denegada"} para el senior con ID: ${senior.id}`)
				navigate("/dashboard/adultos-mayores/nuevos")
			} catch (error) {
				console.error("Error al actualizar el usuario:", error)
			}
		}
	}

	const onSubmit = async (data: any) => {
		console.log("Form Data:", data)
		try {
			console.log("Datos del formulario:", data)
			console.log("ID del senior:", senior.id)

			await api.patch(`/dashboard/seniors/${senior.id}`, data)
			await handleValidate(true)
		} catch (error) {
			console.error("Error al enviar el formulario:", error)
		}
	}

	if (!senior) return null

	return (
		<PageLayout pageTitle="Detalles de adulto mayor">
			<div className="flex gap-8">
				<div className="w-1/2">
					<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit)}>
						<Input
							label="Rut"
							type="text"
							placeholder="Rut"
							defaultValue={senior.id}
							{...register("rut")}
							disabled={true}
						/>
						<Input
							label="Nombre"
							type="text"
							placeholder="Nombre"
							error={errors.name ? errors.name.message?.toString() : ""}
							{...register("name")}
						/>
						<Input
							label="Correo Electrónico"
							type="email"
							placeholder="Correo"
							defaultValue={senior.email}
							{...register("email")}
							disabled={true}
						/>
						<Input
							label="Dirección"
							type="text"
							placeholder="Dirección"
							error={errors.address ? errors.address.message?.toString() : ""}
							{...register("address")}
						/>
						<div className="flex flex-col gap-3 w-full">
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
										selected={value}
										maxDate={new Date()}
										locale="es"
									/>
								)}
							/>
						</div>
						<div className="flex gap-4">
							<button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" key="submit">
								Aceptar
							</button>
							<button
								type="button"
								className="bg-red-500 text-white px-4 py-2 rounded"
								onClick={() => handleValidate(false)}
							>
								Denegar
							</button>
							<button
								type="button"
								className="border-red-500 border-1 text-red-500 px-4 py-2 rounded"
								onClick={() => navigate("/dashboard/adultos-mayores/nuevos")}
							>
								Cancelar
							</button>
						</div>
					</form>
				</div>

				<div className="w-4/5 grid grid-cols-2 gap-4 bg-red-500 p-4">
					<div className="col-span-1 row-span-1 grid-rows-2 bg-blue-500">
						<div className="row-span-1">
							<Image src="/img/frontal.jpg" alt="Cédula Frontal" className="w-full h-full object-cover" />
						</div>
						<div className="row-span-2">
							<Image
								src="/img/reverso.jpeg"
								alt="Cédula Reverso"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
					<div className="col-span-1 row-span-1 bg-blue-500">
						<Image src="/img/regist.png" alt="Cartola Hogar" className="w-full h-full object-cover" />
					</div>
				</div>
			</div>
		</PageLayout>
	)
}

export default SeniorRegisterRequestPage
