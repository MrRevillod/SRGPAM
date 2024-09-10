import { constants } from "../config"
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