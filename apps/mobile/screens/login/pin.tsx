import { View, StyleSheet, Alert } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/utils/types"

import axios from "axios"
import { SERVER_URL } from "@/constants/colors"
import { storeTokens, storeUser } from "@/utils/storage"
import { useEffect } from "react"

const Pin = ({ navigation, control, errors, setValue, handleSubmit, rutSenior }: commonProps) => {
	useEffect(() => {
		if (rutSenior) {
			setValue("rut", rutSenior)
		}
	}, [rutSenior])

	const onSubmit = async (data: any) => {
		try {
			const response = await axios.post(`${SERVER_URL}/api/auth/login-senior`, data)
			if (response.status !== 200) {
				throw new Error("Error en la solicitud")
			}
			const { message, values } = response.data
			Alert.alert(message)
			const { accessToken, refreshToken, publicUser } = values
			storeTokens(accessToken, refreshToken)
			storeUser(publicUser)
		} catch (error) {
			console.error(error)
			Alert.alert("Error", "Hubo un problema al enviar los datos. Intenta nuevamente.")
		}
	}

	return (
		<GeneralView title="Datos del Registro" textCircle="2/2" textTitle="Ingresa tu Pin de 4 dígitos.">
			<View style={styles.container}>
				<Input name="password" placeholder="Ingresa tu pin" control={control} errors={errors} secureTextEntry />
				<CustomButton title="Siguiente" onPress={handleSubmit(onSubmit)} />
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

export default Pin

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
