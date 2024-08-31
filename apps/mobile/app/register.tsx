import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, StyleSheet, Text, TextInput, View } from "react-native"
import Colors from "@/components/colors"

const registerSchema = z.object({
	rut: z.string().min(1, "RUT es requerido"),
	pin: z.string().min(1, "PIN es requerido"),
	pinConfirm: z.string().min(1, "Confirmación de PIN es requerida"),
})

const Stack = createNativeStackNavigator()

const RUT = ({ navigation, control, errors }: { navigation: any; control: any; errors: any }) => {
	return (
		<View style={styles.container}>
			<Controller
				name="rut"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							placeholder="Ingresa tu RUT"
							style={[styles.input, errors.rut && styles.inputError]}
							value={value}
							onBlur={onBlur}
							onChangeText={onChange}
						/>
						{errors.rut && <Text style={styles.errorText}>{errors.rut.message}</Text>}
					</>
				)}
			/>
			<Button title="Siguiente" onPress={() => navigation.navigate("Pin")} />
		</View>
	)
}

const Pin = ({ navigation, control, errors }: { navigation: any; control: any; errors: any }) => {
	return (
		<View style={styles.container}>
			<Controller
				name="pin"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							placeholder="Ingresa tu PIN"
							style={[styles.input, errors.pin && styles.inputError]}
							value={value}
							onBlur={onBlur}
							onChangeText={onChange}
							secureTextEntry={true}
						/>
						{errors.pin && <Text style={styles.errorText}>{errors.pin.message}</Text>}
					</>
				)}
			/>
			<Button title="Siguiente" onPress={() => navigation.navigate("ConfirmPin")} />
			<Button title="Volver" onPress={() => navigation.goBack()} />
		</View>
	)
}

const ConfirmPin = ({ navigation, control, errors, handleSubmit }: { navigation: any; control: any; errors: any; handleSubmit: any }) => {
	const onSubmit = (data: any) => {
		console.log(data)
	}

	return (
		<View style={styles.container}>
			<Controller
				name="pinConfirm"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							placeholder="Confirma tu PIN"
							style={[styles.input, errors.pinConfirm && styles.inputError]}
							value={value}
							onBlur={onBlur}
							onChangeText={onChange}
							secureTextEntry={true}
						/>
						{errors.pinConfirm && <Text style={styles.errorText}>{errors.pinConfirm.message}</Text>}
					</>
				)}
			/>
			<Button title="Finalizar" onPress={handleSubmit(onSubmit)} />
			<Button title="Volver" onPress={() => navigation.goBack()} />
		</View>
	)
}

const FormNavigator = ({ control, handleSubmit, errors }: { control: any; handleSubmit: any; errors: any }) => {
	return (
		<Stack.Navigator initialRouteName="RUT">
			<Stack.Screen name="RUT">{(props) => <RUT {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="Pin">{(props) => <Pin {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="ConfirmPin">
				{(props) => <ConfirmPin {...props} control={control} errors={errors} handleSubmit={handleSubmit} />}
			</Stack.Screen>
		</Stack.Navigator>
	)
}

const App = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(registerSchema),
	})

	return <FormNavigator control={control} handleSubmit={handleSubmit} errors={errors} />
}

export default App

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: Colors.green,
		borderRadius: 5,
		color: Colors.gray,
		alignContent: "center",
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
		width: "80%",
		padding: 10,
	},
	inputError: {
		borderColor: "red",
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginTop: -5,
		marginBottom: 10,
	},
})
