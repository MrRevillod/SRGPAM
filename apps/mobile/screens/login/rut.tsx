import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import { commonProps } from "@/utils/types"
import { useNavigation } from "@react-navigation/native"

const RUT = ({ control, errors }: commonProps) => {
	const navigation = useNavigation()
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="1/2"
			textTitle="Ingresa tu RUT"
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
