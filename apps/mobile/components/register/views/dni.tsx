import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput } from "react-native"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "../types"
import { Controller, useForm } from "react-hook-form"

const DNI = ({ navigation, route, control, errors, setValue }: commonProps) => {
	const [frontPhoto, setFrontPhoto] = useState<string | null>(null)
	const [backPhoto, setBackPhoto] = useState<string | null>(null)
	const [isCapturingFront, setIsCapturingFront] = useState<boolean>(true)

	useEffect(() => {
		if (route.params?.photoUri) {
			if (isCapturingFront) {
				setFrontPhoto(route.params.photoUri)
				console.log("Front photo set:", route.params.photoUri)
				setValue("dni_a", route.params.photoUri)
			} else {
				setBackPhoto(route.params.photoUri)
				console.log("Back photo set:", route.params.photoUri)
				setValue("dni_b", route.params.photoUri)
			}
		}
	}, [route.params?.photoUri])

	const openCamera = (type: "front" | "back") => {
		navigation.navigate("Camera", { from: "DNI" })
	}

	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="5/7"
			textTitle="Sube tu Cédula de Identidad por ambos lados"
			textDescription="La imagen debe ser legible y el documento debe estar vigente."
		>
			<View>
				<Controller
					control={control}
					name="dni_a"
					render={({ field: { value } }) => (
						<>
							<CustomButton
								style={{ marginTop: 30 }}
								title={value ? "Re-tomar Foto Frontal" : "Tomar Foto Frontal"}
								onPress={() => {
									setIsCapturingFront(true)
									openCamera("front")
								}}
							/>
							{value && <Text>Foto frontal tomada</Text>}
						</>
					)}
				/>

				<Controller
					control={control}
					name="dni_b"
					render={({ field: { value } }) => (
						<>
							<CustomButton
								style={{ marginTop: 30 }}
								title={value ? "Re-tomar Foto Trasera" : "Tomar Foto Trasera"}
								onPress={() => {
									setIsCapturingFront(false)
									openCamera("back")
								}}
							/>
							{value && <Text>Foto trasera tomada</Text>}
						</>
					)}
				/>

				<CustomButton
					textStyle={styles.customButtonText}
					title="Siguiente"
					onPress={() => navigation.navigate("RSH")}
					style={{ backgroundColor: Colors.white }}
				/>

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

export default DNI

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
