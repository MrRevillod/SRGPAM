import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import { commonProps } from "@/utils/types"

const RUT = ({ navigation, control, errors }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="1/2"
			textTitle="Ingrese su RUT"
			textDescription="Su RUT debe ingresarse sin puntos ni guión."
		>
			<View style={styles.container}>
				<Input name="rut" placeholder="Ingresa tu RUT" control={control} errors={errors} />
				<CustomButton title="Siguiente" onPress={() => navigation.navigate("Pin")} />
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
