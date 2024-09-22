import { constants } from "../config"
import { IncomingHttpHeaders } from "http"
import { JwtPayload, sign, verify, JsonWebTokenError } from "jsonwebtoken"

const { JWT_SECRET } = constants

type JwtExpiration = `${number}${"s" | "m" | "h" | "d"}`

type TokenOptions = {
	key: string
	exp?: string
	payload?: Object
}

export const AccessTokenOpts: TokenOptions = {
	exp: "15m",
	key: JWT_SECRET,
}

export const RefreshTokenOpts: TokenOptions = {
	exp: "30d",
	key: JWT_SECRET,
}

export const CustomTokenOpts = (customKey: string, exp: JwtExpiration): TokenOptions => {
	return { key: `${JWT_SECRET}${customKey}`, exp }
}

export const signJsonwebtoken = (payload: JwtPayload | Object, opts: TokenOptions) => {
	try {
		return sign(payload, opts.key, { expiresIn: opts.exp })
	} catch (error) {
		throw new JsonWebTokenError("Error signing jsonwebtoken")
	}
}

export const verifyJsonwebtoken = (token: string, opts: TokenOptions): JwtPayload => {
	try {
		return verify(token, opts.key) as JwtPayload
	} catch (error) {
		throw new JsonWebTokenError("Error verifying jsonwebtoken")
	}
}

export type ServerTokens = {
	access: string | null
	refresh: string | null
}

export const getServerTokens = (headers: IncomingHttpHeaders, cookies: any) => {
	const tokens = { access: null, refresh: null } as ServerTokens

	if (
		cookies &&
		(cookies["ACCESS_TOKEN"] !== undefined || cookies["REFRESH_TOKEN"] !== undefined)
	) {
		tokens.access = cookies["ACCESS_TOKEN"] || null
		tokens.refresh = cookies["REFRESH_TOKEN"] || null
		return tokens
	}

	if (headers.authorization && headers.authorization.startsWith("Bearer ")) {
		const tokensString = headers.authorization.split("Bearer ")[1]
		const [accessToken, refreshToken] = tokensString.split(",").map((token) => token.trim())

		tokens.access = accessToken || null
		tokens.refresh = refreshToken || null
		return tokens
	}

	return null
}
