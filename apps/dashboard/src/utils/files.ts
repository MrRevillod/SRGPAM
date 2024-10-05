const bufferToArrayBuffer = (buffer: Buffer): ArrayBuffer => {
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

export const bufferToBlob = (buffer: Buffer, mimeType: string): Blob => {
	const arrayBuffer = bufferToArrayBuffer(buffer)
	return new Blob([arrayBuffer], { type: mimeType })
}

export const filesToFormData = (files: Express.Multer.File[]): FormData => {
	const formData = new FormData()
	files.forEach((file) => {
		const blob = bufferToBlob(file.buffer, file.mimetype)
		formData.append("files", blob, file.originalname)
	})
	return formData
}

export const fileToFormData = (file: Express.Multer.File, filename: string): FormData => {
	const extFile = file.originalname.split(".")[1]
	file.originalname = `${filename}.${extFile}`
	const formData = new FormData()
	formData.append("files", bufferToBlob(file.buffer, file.mimetype), file.originalname)
	return formData
}
