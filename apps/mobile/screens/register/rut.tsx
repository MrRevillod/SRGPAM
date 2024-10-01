import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import { commonProps } from "@/utils/types"
import { checkUniqueField } from "@/utils/request"

const RUT = ({ navigation, control, errors, getValues, setError, trigger }: commonProps) => {
	const onSubmit = async () => {
		const request = await checkUniqueField("rut", getValues, trigger, setError)
		if (request) {
			navigation.navigate("Email")
		}
	}

	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="1/7"
			textTitle="Ingresa tu RUT"
			textDescription="Su RUT debe ingresarse sin puntos ni guión."
		>
			<View style={styles.container}>
				<Input name="rut" placeholder="Ingresa tu RUT" control={control} errors={errors} />
				<CustomButton title="Siguiente" onPress={onSubmit} />
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
