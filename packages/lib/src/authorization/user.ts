import { AppError } from ".."

export const toPublicUser = (user: any) => {
	try {
		if (!user.password) {
			return user
		}

		const { password, ...userData } = user

		return userData
	} catch (error) {
		throw new AppError(404, "Usuario no encontrado")
	}
}
