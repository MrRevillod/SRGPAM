import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Register from "./register"
import Login from "./login"
import Menu from "../screens/menu"
import Profile from "../screens/myProfile"
import NewProfile from "@/screens/newProfile"
import Camera from "@/components/camera"
import { NavigationContainer } from "@react-navigation/native"

const Stack = createNativeStackNavigator()

const App = () => {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Menu" component={Menu} />
				<Stack.Screen name="Register" component={Register} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Profile" component={Profile} />
				<Stack.Screen name="NewProfile" component={NewProfile} />
				<Stack.Screen name="Camera" component={Camera} options={{ headerShown: true }} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App
