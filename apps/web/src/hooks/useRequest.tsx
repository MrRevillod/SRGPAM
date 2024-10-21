import { useEffect, useState, useRef } from "react"
import { ApiError, QueryAction } from "../lib/types"

interface useRequestResult<T> {
	data: T | null
	loading: boolean
	error: ApiError
	status: number
	refetch: () => void
}

interface useRequestProps<T> {
	action: QueryAction
	query?: string
	onSuccess?: (data: T) => void
	trigger?: boolean
}

export const useRequest = <T,>({
	action,
	query,
	onSuccess,
	trigger = true,
}: useRequestProps<T>): useRequestResult<T> => {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<ApiError>(null)
	const [status, setStatus] = useState<number>(200)

	const fetchDataRef = useRef<() => void>(() => {})

	const fetchData = async () => {
		try {
			setLoading(true)
			const response = await action({ query })
			setData(response.data.values as T)
			setError(null)
			setStatus(response.status)
			if (onSuccess) onSuccess(response.data.values as T)
		} catch (err: any) {
			if (err.response?.data) {
				setStatus(err.response?.status)
				setError(err.response?.data?.message || "Error desconocido")
			}
		} finally {
			setLoading(false)
		}
	}

	fetchDataRef.current = fetchData

	useEffect(() => {
		if (!trigger) return
		fetchData()
	}, [action, query, trigger])

	return { data, loading, error, status, refetch: fetchDataRef.current }
}

// import { useEffect, useState } from "react"
// import { ApiError, QueryAction } from "../lib/types"

// interface useRequestResult<T> {
// 	data: T | null
// 	loading: boolean
// 	error: ApiError
// 	status: number
// }

// interface useRequestProps<T> {
// 	action: QueryAction
// 	query?: string
// 	onSuccess?: (data: T) => void
// 	trigger?: boolean
// }

// export const useRequest = <T,>({
// 	action,
// 	query,
// 	onSuccess,
// 	trigger = true,
// }: useRequestProps<T>): useRequestResult<T> => {
// 	const [data, setData] = useState<T | null>(null)
// 	const [loading, setLoading] = useState<boolean>(false)
// 	const [error, setError] = useState<ApiError>(null)
// 	const [status, setStatus] = useState<number>(200)

// 	useEffect(() => {
// 		if (!trigger) return

// 		const fetchData = async () => {
// 			try {
// 				setLoading(true)
// 				const response = await action({ query })
// 				setData(response.data.values as T)
// 				setError(null)
// 				setStatus(response.status)
// 				if (onSuccess) onSuccess(response.data.values as T)
// 			} catch (err: any) {
// 				if (err.response?.data) {
// 					setStatus(err.response?.status)
// 					setError(err.response?.data?.message || "Error desconocido")
// 				}
// 			} finally {
// 				setLoading(false)
// 			}
// 		}

// 		fetchData()
// 	}, [action, query, trigger])

// 	return { data, loading, error, status }
// }
