import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/components/register/types"

const ConfirmPin = ({ navigation, control, errors, handleSubmit }: commonProps) => {
	return (
		<GeneralView title="Datos del Registro" textCircle="4/7" textTitle="Vuelve a ingresar tu Pin.">
			<View style={styles.container}>
				<Input name="pinConfirm" placeholder="Confirma tu PIN" control={control} errors={errors} secureTextEntry visible />
				<CustomButton title="Siguiente" onPress={() => navigation.navigate("DNI")} />
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

export default ConfirmPin

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
