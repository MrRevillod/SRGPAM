import { useState, useEffect } from "react"
import { View, StyleSheet, Text, Alert } from "react-native"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/components/register/types"
import { Controller, useForm } from "react-hook-form"
import * as mime from "react-native-mime-types"
import axios from "axios"

import { SERVER_URL } from "@/constants/colors"

const RSH = ({ navigation, route, control, setValue, handleSubmit }: commonProps) => {
	useEffect(() => {
		if (route.params?.photoUri) {
			console.log("RSH photo URI:", route.params.photoUri)
			setValue("social", route.params.photoUri)
		}
	}, [route.params?.photoUri])

	const openCamera = () => {
		navigation.navigate("Camera", { from: "RSH" })
	}

	const onSubmit = async (data: any) => {
		const formData = new FormData()

		formData.append("rut", data.rut)
		formData.append("pin", data.pin)
		formData.append("email", data.email)

		const uriToFileObject = (uri: string, name: string) => {
			const fileName = `${name}.jpg`
			const fileType = mime.lookup(uri) || "image/jpeg"

			return {
				uri: uri, // URI local del archivo
				type: fileType, // Tipo MIME (image/jpeg por defecto)
				name: fileName, // Nombre del archivo
			}
		}

		if (data.dni_a) {
			const dniAFile = uriToFileObject(data.dni_a, "dni-a")
			formData.append("dni-a", dniAFile as any)
		}
		if (data.dni_b) {
			const dniBFile = uriToFileObject(data.dni_b, "dni-b")
			formData.append("dni-b", dniBFile as any)
		}
		if (data.social) {
			const socialFile = uriToFileObject(data.social, "social")
			formData.append("social", socialFile as any)
		}
		try {
			console.log("Enviado documentos")

			console.log(SERVER_URL)
			const response = await axios.post(`${SERVER_URL}/api/dashboard/seniors/new-mobile`, formData)

			console.log(response)
			console.log("formData", formData)

			if (response.status !== 200) {
				throw new Error("Error en la solicitud")
			}

			const result = response.data
			console.log(result)

			navigation.navigate("Final")
		} catch (error) {
			console.error(error)
			Alert.alert("Error", "Hubo un problema al enviar los datos. Intenta nuevamente.")
		}
	}

	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="6/7"
			textTitle="Sube tu Registro Social de Hogares"
			textDescription="Recuerda que la imagen debe ser legible y estar actualizada"
		>
			<View>
				<Controller
					name="social"
					control={control}
					render={({ field: { value } }) => (
						<>
							<CustomButton
								style={{ marginTop: 30 }}
								title={value ? "Re-tomar Foto" : "Tomar Foto"}
								onPress={() => {
									openCamera()
								}}
							/>
							{value && <Text>Foto tomada</Text>}
						</>
					)}
				/>

				<CustomButton style={{ marginTop: 30, backgroundColor: Colors.green }} title="Enviar Formulario" onPress={handleSubmit(onSubmit)} />

				<CustomButton
					style={{ backgroundColor: Colors.white }}
					textStyle={styles.customButtonText}
					title="Volver"
					onPress={() => navigation.goBack()}
				/>
			</View>
		</GeneralView>
	)
}

export default RSH

const styles = StyleSheet.create({
	customButtonText: {
		color: Colors.green,
	},
})