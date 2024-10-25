import pLimit from 'p-limit'
import cloudinary from 'cloudinary'
cloudinary.v2.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export function base64ToFile(
	base64: string,
	filename: string,
	mimeType: string
): File {
	const byteString = atob(base64.split(',')[1])
	const arrayBuffer = new ArrayBuffer(byteString.length)
	const intArray = new Uint8Array(arrayBuffer)

	for (let i = 0; i < byteString.length; i++) {
		intArray[i] = byteString.charCodeAt(i)
	}

	return new File([intArray], filename, { type: mimeType })
}

export async function uploadImages(images: File[], limit: number) {
	const limitImg = pLimit(limit)

	const uploadPromises = images.map(async image => {
		const buffer = Buffer.from(await image.arrayBuffer())
		return limitImg(async () => {
			const result = await new Promise<string>((resolve, reject) => {
				cloudinary.v2.uploader
					.upload_stream({ resource_type: 'image' }, (error, result) => {
						if (error) reject(error)
						else resolve(result?.secure_url as string)
					})
					.end(buffer)
			})
			return result
		})
	})

	return uploadPromises
}
