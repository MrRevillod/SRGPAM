import { useState, useEffect } from "react"
import { View, StyleSheet, Text } from "react-native"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/components/register/types"
import { Controller, useForm } from "react-hook-form"

const RSH = ({ navigation, route, control, setValue, handleSubmit }: commonProps) => {
	const [rshPhoto, setRshPhoto] = useState<string | null>(null)

	useEffect(() => {
		if (route.params?.photoUri) {
			setRshPhoto(route.params.photoUri)
			console.log("RSH photo URI:", route.params.photoUri)
			setValue("social", route.params.photoUri)
		}
	}, [route.params?.photoUri])

	const openCamera = () => {
		navigation.navigate("Camera", { from: "RSH" })
	}

	const onSubmit = (data: any) => {
		console.log(data)
		navigation.navigate("Final")
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
