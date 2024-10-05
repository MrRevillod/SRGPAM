import axios from "axios"

// Instancia de axios con la configuración base para hacer peticiones al servidor
// baseURL: URL base de la API (definida en el archivo .env)
// withCredentials: true para enviar las cookies en las peticiones
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL as string,
	withCredentials: true,
})

// Implementación de axios interceptors para manejar el refresco del token de acceso
// Funcionamiento:

// 1. Interceptamos las respuestas del servidor
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		const ogStatus = error.response?.status
		const ogUrl = originalRequest.url

		// 2. Si la respuesta es un 401 (No autorizado) y no es una petición de refresco o login
		//    principalmente debido a que si el refresh falla no se debe intentar de nuevo
		//    y si el login falla no se debe intentar de nuevo

		const isUnauthorized = ogStatus === 401
		const isRefresheable =
			!originalRequest._retry && !ogUrl.includes("/auth/refresh") && !ogUrl.includes("/auth/login")

		// Comprobar si estamos en la página de login

		const isLoginPage = window.location.pathname.includes("login")

		if (isUnauthorized && isRefresheable) {
			originalRequest._retry = true

			// 3. No hacer refresh si estamos en la página de login y el endpoint es /validate-auth
			if (isLoginPage && ogUrl.includes("/validate-auth")) {
				return Promise.reject(error) // No hacer nada y rechazar el error
			}

			// 4. Intentamos refrescar el token de acceso haciendo una petición
			//    al endpoint /auth/refresh (GET) - Requiere el token de refresco en las cookies

			return api.get("/auth/refresh").then((res) => {
				if (res.status === 200) {
					// 5. Si la petición es exitosa, reintentamos la petición original
					// y retornamos la respuesta del servidor, así el usuario no se da cuenta
					// de que su token de acceso fue refrescado y su sesión sigue activa

					return api(originalRequest)
				}

				return Promise.reject(error)
			})
		}

		return Promise.reject(error)
	}
)
