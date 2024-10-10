import { useState, useEffect } from "react"
import { ApiAction, ApiError } from "../lib/types"

interface useRequestResult<T> {
	data: T | null
	loading: boolean
	error: ApiError
	config: any
}

interface useRequestProps<T> {
	action: ApiAction
	params?: T
}

export const useRequest = <T, P = any>({ action, params }: useRequestProps<P>): useRequestResult<T> => {
	const [data, setData] = useState<T | null>(null)
	const [config, setConfig] = useState<any>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<ApiError>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await action(params ?? {})
				setData(response.data.values as T)
				setError(null)
				setConfig(response.config)
			} catch (err: any) {
				if (err.response?.data) {
					setError(err.response?.data?.message || "Error desconocido")
				}
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [action, params])

	return { data, loading, error, config }
}
