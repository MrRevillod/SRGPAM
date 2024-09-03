const bufferToArrayBuffer = (buffer: Buffer): ArrayBuffer => {
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

export const bufferToBlob = (buffer: Buffer, mimeType: string): Blob => {
	const arrayBuffer = bufferToArrayBuffer(buffer)
	return new Blob([arrayBuffer], { type: mimeType })
}
