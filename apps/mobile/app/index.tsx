import { Text, View } from "react-native"
import Constants from "expo-constants"

const Home = () => (
	<View style={{ paddingTop: Constants.statusBarHeight, flex: 1, justifyContent: "center", alignItems: "center" }}>
		<Text>Todo está funcionando correctamente...</Text>
	</View>
)

export default Home
