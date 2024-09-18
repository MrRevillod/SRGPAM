import { LoginFormData } from "./types"

export type RequestOpts = {
	method: string
	url: string
	headers?: Record<string, string>
	data?: Record<any, any> | FormData
}

export const getSeniorsOpts: RequestOpts = {
	method: "GET",
	url: "/dashboard/administrators",
	headers: {
		"Content-Type": "application/json",
	},
}

export const loginOpts = (body: Partial<LoginFormData>): RequestOpts => {
	return {
		method: "POST",
		url: `/auth/login?variant=${body.role}`,
		headers: {
			"Content-Type": "application/json",
		},
		data: { email: body.email, password: body.password },
	} as RequestOpts
}

export const logoutOpts: RequestOpts = {
	method: "POST",
	url: "/auth/logout",
	headers: {
		"Content-Type": "application/json",
	},
}

export const validateSessionOpts: RequestOpts = {
	method: "GET",
	url: "/auth/validate-auth",
	headers: {
		"Content-Type": "application/json",
	},
}
