import { createNativeStackNavigator } from "@react-navigation/native-stack"
import RUT from "@/screens/login/rut"
import Pin from "@/screens/login/pin"
import { FormProvider, useForm } from "react-hook-form"
import React, { useEffect, useState } from "react"
import { getStorageRUT } from "@/utils/storage"
import { View, ActivityIndicator } from "react-native"

const Stack = createNativeStackNavigator()

const Login = () => {
	const methods = useForm({
		defaultValues: {
			rut: "",
			password: "",
		},
	})
	const [rut, setRUT] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getRUT = async () => {
			try {
				const id = await getStorageRUT()

				setRUT(id)
				setLoading(false)
			} catch (error) {}
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
		<FormProvider {...methods}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{rut !== null ? (
					<Stack.Screen name="Pin" component={Pin} initialParams={{ rutSenior: rut }} />
				) : (
					<>
						<Stack.Screen name="RUT" component={RUT} />
						<Stack.Screen name="Pin" component={Pin} />
					</>
				)}
			</Stack.Navigator>
		</FormProvider>
	)
}

export default Login
