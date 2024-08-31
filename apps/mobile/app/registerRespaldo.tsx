import { zodResolver } from "@hookform/resolvers/zod"
import { Text, View, TextInput, Button, Alert, StyleSheet } from "react-native"
import { useForm, Controller } from "react-hook-form"
import Colors from "@/components/colors"
import { z } from "zod"

const registerSchema = z.object({
	rut: z.string().min(1),
	pin: z.string().min(1),
	pinConfirm: z.string().min(1),
})

const Register = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(registerSchema),
	})

	const onSubmit = (data: any) => {
		console.log(data)
	}

	return (
		<View style={styles.container}>
			<Text>Register</Text>
			<Controller
				name="rut"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput placeholder="Ingresa tu rut" style={styles.input} value={value} onBlur={onBlur} onChange={onChange} />
				)}
			/>
			<Controller
				name="pin"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput placeholder="Ingresa tu pin" style={styles.input} value={value} onBlur={onBlur} onChange={onChange} />
				)}
			/>
			<Controller
				name="pinConfirm"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput placeholder="Confirma tu pin" style={styles.input} value={value} onBlur={onBlur} onChange={onChange} />
				)}
			/>

			<Button title="submit" onPress={handleSubmit(onSubmit)}></Button>
		</View>
	)

	// return (
}

export default Register

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		width: "83%",
		height: "4.125%",
		borderWidth: 1,
		borderColor: Colors.green,
		borderRadius: 5,
		color: Colors.gray,
		alignContent: "center",
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
	},
})
