import { View, StyleSheet, Alert } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { useEffect } from "react"
import { useAuth } from "@/contexts/authContext"
import { useFormContext } from "react-hook-form" // Importa useFormContext

const Pin = ({ navigation, route }: any) => {
	const { rutSenior } = route.params
	const { setValue, handleSubmit } = useFormContext()

	useEffect(() => {
		if (rutSenior) {
			setValue("rut", rutSenior)
		}
	}, [rutSenior])

	const { login } = useAuth()

	const onSubmit = async (data: any) => {
		await login(data)
		navigation.navigate("Menu")
	}

	return (
		<GeneralView title="Datos del Registro" textCircle="2/2" textTitle="Ingrese su Pin de 4 dígitos">
			<View style={styles.container}>
				<Input name="password" placeholder="Ingresa tu pin" secureTextEntry />
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
