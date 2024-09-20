import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import { commonProps } from "@/components/types"

const RUT = ({ navigation, control, errors, validateAndNavigate }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="1/7"
			textTitle="Ingresa tu RUT"
			textDescription="Su RUT debe ingresarse sin puntos ni guión."
		>
			<View style={styles.container}>
				<Input name="rut" placeholder="Ingresa tu RUT" control={control} errors={errors} />
				<CustomButton title="Siguiente" onPress={() => validateAndNavigate("rut", navigation, "Email")} />
			</View>
		</GeneralView>
	)
}

export default RUT

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
})
