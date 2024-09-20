import axios from "axios"

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL as string,
	withCredentials: true,
})

// api.interceptors.request.use(
// 	(response) => response,
// 	async (err) => {
// 		const { setAuth } = useAuth()
// 		const { data, useRequest } = useRequestStore()

// 		if (err.response?.status === 401) {
// 			console.log("Refreshing session")

// 			try {
// 				await useRequest(refreshSessionOpts, false)
// 				setAuth(true, data?.values.user)
// 			} catch (error) {
// 				setAuth(false, null)
// 			}
// 		}

// 		return Promise.reject(err)
// 	}
// )
