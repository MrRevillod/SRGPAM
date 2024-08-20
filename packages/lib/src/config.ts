import dotenv from "dotenv"

dotenv.config({ path: "../../.env" })

export const config = {
	api_port: process.env.PORT || 3000,
}
