import { auth } from '@/auth'
import { getAllChats, sendImgMessage } from '@/services/message.services'
import { NextResponse } from 'next/server'
import { uploadImages } from '@/lib/cloudinary'

export async function GET() {
	try {
		const session = await auth()
		if (session !== null) {
			const result = await getAllChats(+session.user.id)

			return NextResponse.json(result)
		} else {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
	} catch (error) {
		return NextResponse.json(
			{ error: 'Сталася помилка на сервері' },
			{ status: 500 }
		)
	}
}

export async function POST(req: Request) {
	try {
		const session = await auth()
		const body = await req.json()
		if (session !== null) {
			const formData = await req.formData()
			const image = formData.get('image') as File

			const uploadPromises = await uploadImages([image], 1)
			const uploadImg = await Promise.all(uploadPromises)
			const result = await sendImgMessage(
				+session.user.id,
				body.conversationId,
				'image',
				uploadImg[0]
			)
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
