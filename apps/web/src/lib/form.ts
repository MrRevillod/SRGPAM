import { FieldValues, useFormContext } from "react-hook-form"

export const handleConflicts = (entityName: string, conflicts: string[]) => {
	const { setError } = useFormContext()

	conflicts.forEach((element: string) => {
		setError(element, {
			type: "manual",
			message: `Ya existe un ${entityName} con este valor`,
		})
	})
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
