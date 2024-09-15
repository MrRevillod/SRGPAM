import { AppError } from ".."

type userProps = {
	id: string
	name: string
	email: string
	address: string
	birthDate: string
}

export const userWithoutPassword = (user: any) => {
	try {
		if (!user) {
			throw new AppError(404, "Usuario no encontrado")
		}

		const userWithoutPassword: userProps = {
			id: user.id || null,
			name: user.name || null,
			email: user.email || null,
			address: user.address || null,
			birthDate: user.birthDate || null,
		}

		return userWithoutPassword
	} catch (error) {
		throw new AppError(404, "Usuario no encontrado")
	}
}
