import { api } from "../lib/axios"
import { toast } from "sonner"
import { create } from "zustand"
import { RequestOpts } from "../lib/requests"
import { ApiResponse } from "../lib/types"

type requestStatus = "idle" | "loading" | "success" | "error"

interface RequestStore {
	code: number
	status: requestStatus
	error: string | null
	data: ApiResponse | null
	isLoading: boolean
	reset: () => void
	useRequest: (reqOpts: RequestOpts, notificate?: boolean) => Promise<void>
}

export const useRequestStore = create<RequestStore>((set, get) => ({
	code: 0,
	status: "idle",
	error: null,
	data: null,
	isLoading: false,
	reset: () => set({ status: "idle", error: null, data: null, isLoading: false, code: 0 }),

	useRequest: async (reqOpts, notificate = true) => {
		set({ isLoading: true })

		try {
			const { status, data } = await api.request(reqOpts)

			set({
				status: "success",
				isLoading: false,
				code: status,
				error: null,
				data: data,
			})
		} catch (error: any) {
			set({
				status: "error",
				isLoading: false,
				code: error.response?.status || 500,
				error: error.response?.data?.message || "Ha ocurrido un error",
				data: null,
			})
		} finally {
			if (get().status === "success" && notificate) {
				toast.success(get().data?.message)
			}

			if (get().status === "error" && notificate) {
				toast.error(get().error)
			}
		}
	},
}))
