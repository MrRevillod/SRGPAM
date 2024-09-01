import React from "react"
import { View, TextInput, Text } from "react-native"
import { Controller } from "react-hook-form"
import { StyleSheet } from "react-native"
import Colors from "@/components/colors"

type InputFieldProps = {
	name: string
	placeholder: string
	control: any
	errors: any
	secureTextEntry?: boolean
	children?: React.ReactNode
}

const InputField = ({ name, placeholder, control, errors, secureTextEntry = false, children }: InputFieldProps) => {
	return (
		<View style={styles.container}>
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							style={styles.input}
							placeholder={placeholder}
							value={value}
							onBlur={onBlur}
							onChangeText={onChange}
							secureTextEntry={secureTextEntry}
						/>
						{errors[name] && <Text style={{ color: "red" }}>{errors[name].message}</Text>}
					</>
				)}
			/>
			{children}
		</View>
	)
}

export default InputField

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	input: {
		backgroundColor: Colors.white,
		borderRadius: 10,
		borderColor: Colors.green,
		borderWidth: 1,
		width: "auto",
		paddingVertical: 10,
		textAlign: "center",
		marginTop: 30,
		marginBottom: 10,
		color: Colors.gray,
		fontSize: 18,
	},
})
