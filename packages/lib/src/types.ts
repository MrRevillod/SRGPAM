export type JsonResponse = {
	message: string
	type: "success" | "error"
	values?: Record<string, unknown> | unknown[] | null
}
