import { auth } from '@/auth'
import { uploadImages } from '@/lib/cloudinary'
import { createPost } from '@/services/post.services'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const session = await auth()
		if (session !== null) {
			const formData = await req.formData()
			const content = formData.get('content') as string
			const images = formData.getAll('images') as File[]

			const uploadPromises = await uploadImages(images, 5)
			const uploadResults = await Promise.all(uploadPromises)

			const result = await createPost(content, +session.user.id, uploadResults)

			return NextResponse.json(result)
		} else {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to upload images' },
			{ status: 500 }
		)
	}
}
