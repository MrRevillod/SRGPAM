import axios from "axios"

export const useImage = async (imageUrl: string, setImageUrl: (url: string) => void) => {
	try {
		const response = await axios.get(imageUrl, {
			headers: {
				"x-storage-key": `${import.meta.env.VITE_STORAGE_KEY}`,
			},
			responseType: "blob",
		})
		const imageBlobUrl = URL.createObjectURL(response.data)
		setImageUrl(imageBlobUrl)
	} catch (error) {
		console.log("Error", error)
	}
}
