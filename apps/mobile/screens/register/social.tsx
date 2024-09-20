import { useEffect } from "react"
import { View, StyleSheet, Text, Alert } from "react-native"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/components/types"
import { Controller } from "react-hook-form"
import * as mime from "react-native-mime-types"
import axios from "axios"

import { SERVER_URL } from "@/constants/colors"

const Social = ({ navigation, route, control, setValue, handleSubmit }: commonProps) => {
	useEffect(() => {
		if (route.params?.photoUri) {
			console.log("RSH photo URI:", route.params.photoUri)
			setValue("social", route.params.photoUri)
		}
	}, [route.params?.photoUri])

	const openCamera = () => {
		navigation.navigate("Camera", { from: "Social" })
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
				uri: uri,
				type: fileType,
				name: fileName,
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
			const response = await axios.post(`${SERVER_URL}/api/dashboard/seniors/new-mobile`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})

			if (response.status !== 200) {
				throw new Error("Error en la solicitud")
			}

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

export default Social

const styles = StyleSheet.create({
	customButtonText: {
		color: Colors.green,
	},
})
