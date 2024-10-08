import React, { useEffect } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Register from "./register"
import Login from "./login"
import Menu from "../screens/menu"
import Profile from "../screens/myProfile"
import NewProfile from "@/screens/newProfile"
import Camera from "@/components/camera"
import { io } from "socket.io-client"
import { SERVER_URL, SERVER_URL_WS } from "@/constants/colors"
import { SocketProvider } from "@/contexts/socketContext"

const Stack = createNativeStackNavigator()

const App = () => {
	return (
		// <SocketProvider userId="tomas" userRole="SENIOR">
		<Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Menu" component={Menu} />
			<Stack.Screen name="Register" component={Register} />
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Profile" component={Profile} />
			<Stack.Screen name="NewProfile" component={NewProfile} />
			<Stack.Screen name="Camera" component={Camera} options={{ headerShown: true }} />
		</Stack.Navigator>
		//</SocketProvider>
	)
}

export default App
