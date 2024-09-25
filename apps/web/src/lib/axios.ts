import axios from "axios"

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL as string,
	withCredentials: true,
})

// api.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 		if (error.response?.status === 401) {
// 			try {
// 				await api.get("/auth/refresh")
// 			} catch (error) {
// 				return Promise.reject(error)
// 			}
// 		}

// 		return Promise.reject(error)
// 	}
// )
