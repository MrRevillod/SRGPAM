import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/utils/types"

const ConfirmPin = ({ navigation, control, errors, validateAndNavigate }: commonProps) => {
	return (
		<GeneralView title="Datos del Registro" textCircle="4/7" textTitle="Vuelve a ingresar tu Pin.">
			<View style={styles.container}>
				<Input name="pinConfirm" placeholder="Confirma tu PIN" control={control} errors={errors} secureTextEntry />
				<CustomButton title="Siguiente" onPress={() => validateAndNavigate("pinConfirm", navigation, "DNI")} />
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