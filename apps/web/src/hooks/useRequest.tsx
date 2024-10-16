import { useEffect, useState } from "react"
import { ApiError, QueryAction } from "../lib/types"

interface useRequestResult<T> {
	data: T | null
	loading: boolean
	error: ApiError
	status: number
}

interface useRequestProps {
	action: QueryAction
	query?: string
}

export const useRequest = <T,>({ action, query }: useRequestProps): useRequestResult<T> => {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<ApiError>(null)
	const [status, setStatus] = useState<number>(200)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const response = await action({ query })
				setData(response.data.values as T)
				setError(null)
				setStatus(response.status)
			} catch (err: any) {
				if (err.response?.data) {
					setStatus(err.response?.status)
					setError(err.response?.data?.message || "Error desconocido")
				}
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [action, query])

	return { data, loading, error, status }
}
