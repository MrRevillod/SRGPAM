interface ServerCookies {
	access: string | null
	refresh: string | null
	oauth: string | null
}

type Cookies = Record<string, string>

export const getServerCookies = (cookies: any): ServerCookies => {
	const serverCookies: ServerCookies = {
		access: null,
		refresh: null,
		oauth: null,
	}

	if (cookies.access) {
		serverCookies.access = cookies.access
	}

	if (cookies.refresh) {
		serverCookies.refresh = cookies.refresh
	}

	if (cookies.oauth) {
		serverCookies.oauth = cookies.oauth
	}

	return serverCookies
}
