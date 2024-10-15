import { message } from "antd"
import { FieldValues } from "react-hook-form"

export const getContentType = (body: any) => {
	return body instanceof FormData ? "multipart/form-data" : "application/json"
}

export const buildRequestBody = (data: any): FormData | FieldValues => {
	let formData = new FormData()

	if (data.birthDate) {
		data.birthDate = new Date(data.birthDate).toISOString()
	}

	if (data.image) {
		Object.keys(data).forEach((key) => {
			if (key === "image") {
				formData.append("image", data.image)
			} else {
				formData.append(key, data[key])
			}
		})
	}

	return data.image ? formData : data
}

export const handleFormError = (error: any, setError: any) => {
	if (error.response) {
		message.error(error.response.data.message)
		if (error.response.status === 409) {
			error.response.data.values.conflicts.forEach((element: string) => {
				setError(element, {
					type: "manual",
					message: "El campo ya existe",
				})
			})
		}
	} else {
		console.log(error)
		message.error("Error. Intente nuevamente.")
	}
}
