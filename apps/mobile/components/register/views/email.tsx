import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/components/register/types"

const Email = ({ navigation, control, errors }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="2/7"
			textTitle="¿Deseas Ingresar Email?"
			textDescription="Este campo es opcional por lo que usted decide si ingresarlo."
		>
			<View style={styles.container}>
				<Input name="email" placeholder="TuCorreo@gmail.com" control={control} errors={errors} visible />
				<CustomButton title="Siguiente" onPress={() => navigation.navigate("Pin")} />
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

export default Email

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
