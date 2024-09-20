import { createNativeStackNavigator } from "@react-navigation/native-stack"
import RUT from "@/screens/login/rut"
import Pin from "@/screens/login/pin"
import { useForm } from "react-hook-form"
import React, { useEffect, useState } from "react"
import { getStorageRUT } from "@/utils/storage"
import { View, ActivityIndicator } from "react-native"

const Stack = createNativeStackNavigator()

const FormNavigator = ({ control, handleSubmit, errors, setValue }: { control: any; handleSubmit: any; errors: any; setValue: any }) => {
	const [rut, setRUT] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getRUT = async () => {
			try {
				const id = await getStorageRUT()
				if (!id) {
					console.error("No se pudo obtener el RUT")
				}
				setRUT(id)
				setLoading(false)
			} catch (error) {
				console.error("Error al obtener el RUT", error)
			}
		}
		getRUT()
	}, [])

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		)
	}

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{rut !== null ? (
				<Stack.Screen name="Pin">
					{(props) => <Pin {...props} control={control} errors={errors} setValue={setValue} handleSubmit={handleSubmit} rutSenior={rut} />}
				</Stack.Screen>
			) : (
				<>
					<Stack.Screen name="RUT">{(props) => <RUT {...props} control={control} errors={errors} />}</Stack.Screen>
					<Stack.Screen name="Pin">
						{(props) => <Pin {...props} control={control} errors={errors} setValue={setValue} handleSubmit={handleSubmit} />}
					</Stack.Screen>
				</>
			)}
		</Stack.Navigator>
	)
}

const Login = () => {
	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			rut: "",
			password: "",
		},
	})

	return <FormNavigator control={control} handleSubmit={handleSubmit} errors={errors} setValue={setValue} />
}

export default Login
