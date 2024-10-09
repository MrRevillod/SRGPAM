import React from "react"
import PageLayout from "../../layouts/PageLayout"

import { api } from "../../lib/axios"
import { Input } from "../../components/ui/Input"
import { useEffect } from "react"
import { DatePicker } from "../../components/ui/InputDate"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../lib/schemas"
import { message, Image } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form"

const SeniorRegisterRequestPage: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const { senior } = location.state || {}

	useEffect(() => {
		if (!senior) {
			navigate("/dashboard/personas-mayores/nuevos")
		}
	}, [senior])

	const methods = useForm({
		resolver: zodResolver(SeniorSchemas.Validate),
	})

	const { reset, handleSubmit } = methods

	useEffect(() => {
		if (senior) {
			reset({
				rut: senior.id,
				email: senior.email,
			})
		}
	}, [senior])

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		try {
			await api.patch(`/dashboard/seniors/${senior.id}/new?validate=true`, {
				name: data.name,
				address: data.address,
				birthDate: data.birthDate,
			})

			message.success("Solicitud aceptada")
			navigate("/dashboard/personas-mayores/nuevos")
		} catch (error: any) {
			console.error("Error al enviar el formulario:", error.response)
		}
	}

	const onDeny = async () => {
		try {
			await api.patch(`/dashboard/seniors/${senior.id}/new?validate=false`)
			console.log(`Solicitud denegada para el senior con ID: ${senior.id}`)
			navigate("/dashboard/personas-mayores/nuevos")
			message.success("Solicitud denegada")
		} catch (error) {
			message.error("Error al actualizar la solicitud. Intente nuevamente.")
			console.error("Error al actualizar el usuario:", error)
		}
	}

	return (
		<PageLayout pageTitle="Solicitud de registro de persona mayor">
			<section className="flex flex-row gap-12 items-start w-full h-full">
				<FormProvider {...methods}>
					<form className="flex flex-col gap-4 w-2/5" onSubmit={handleSubmit(onSubmit)}>
						<Input
							name="rut"
							label="Rut (Sin puntos ni guión)"
							type="text"
							placeholder="Rut"
							readOnly={true}
						/>
						<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
						<Input
							name="email"
							label="Correo Electrónico"
							type="email"
							placeholder="Email"
							readOnly={true}
						/>
						<Input name="address" label="Dirección" type="text" placeholder="Dirección" />
						<DatePicker name="birthDate" label="Fecha de nacimiento" />

						<div className="flex flex-col gap-8">
							<p>
								<strong>Nota:</strong> Al aceptar esta solicitud, la persona mayor podrá iniciar sesión
								en la aplicación móvil, solicitar servicios y asistir a las horas de atención
								solicitadas.
							</p>

							<div className="flex gap-4">
								<button
									key="submit"
									type="submit"
									className="bg-green-700 text-white px-4 py-2 rounded-lg"
								>
									Aceptar
								</button>
								<button onClick={() => onDeny()} className="bg-red-700 text-white px-4 py-2 rounded-lg">
									Denegar
								</button>
								<button
									onClick={() => navigate("/dashboard/personas-mayores/nuevos")}
									className="border-red-700 border-1 text-red-700 px-4 py-2 rounded-lg"
								>
									Cancelar
								</button>
							</div>
						</div>
					</form>
				</FormProvider>

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
