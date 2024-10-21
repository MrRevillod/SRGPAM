import React from "react"
import PageLayout from "../../layouts/PageLayout"

import { api } from "../../lib/axios"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { useEffect } from "react"
import { DatePicker } from "../../components/ui/InputDate"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "../../hooks/useMutation"
import { SeniorSchemas } from "../../lib/schemas"
import { message, Image } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form"
import DatetimeSelect from "../../components/ui/DatetimeSelect"

const SeniorRegisterRequestPage: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const { senior } = location.state || {}

	const methods = useForm({ resolver: zodResolver(SeniorSchemas.Validate) })
	const { reset, handleSubmit } = methods

	useEffect(() => {
		if (!senior) navigate("/personas-mayores/nuevos")
		else reset({ rut: senior.id, email: senior.email })
	}, [senior])

	const AcceptMutation = useMutation<void>({
		mutateFn: async () => {
			return await api.patch(`/seniors/${senior.id}/new?validate=true`)
		},
	})

	const DenyMutation = useMutation<void>({
		mutateFn: async () => {
			return await api.patch(`/dashboard/seniors/${senior.id}/new?validate=false`)
		},
	})

	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
		await AcceptMutation.mutate({
			params: { body: formData },
			onSuccess: () => {
				message.success("Solicitud aceptada")
				navigate("/personas-mayores/nuevos")
			},
			onError: (error) => {
				message.error("Error al aceptar la solicitud. Intente nuevamente.")
				console.error("Error al aceptar la solicitud:", error)
			},
		})
	}

	const onDeny = async () => {
		await DenyMutation.mutate({
			onSuccess: () => {
				message.success("Solicitud denegada")
				navigate("/personas-mayores/nuevos")
			},
			onError: (error) => {
				message.error("Error al denegar la solicitud. Intente nuevamente.")
				console.error("Error al denegar la solicitud:", error)
			},
		})
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
						<DatetimeSelect name="birthDate" label="Fecha de nacimiento" showTime={false} />

						<div className="flex flex-col gap-8">
							<p>
								<strong>Nota:</strong> Al aceptar esta solicitud, la persona mayor podrá iniciar sesión
								en la aplicación móvil, solicitar servicios y asistir a las horas de atención
								solicitadas.
							</p>

							<div className="flex gap-4">
								<Button variant="primary" type="submit">
									Aceptar
								</Button>

								<Button variant="delete" type="button" onClick={() => onDeny()}>
									Denegar
								</Button>

								<Button
									variant="secondary"
									type="button"
									onClick={() => navigate("/personas-mayores/nuevos")}
								>
									Cancelar
								</Button>
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
