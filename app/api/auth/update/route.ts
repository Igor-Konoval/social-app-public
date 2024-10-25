import { auth } from '@/auth'
import { uploadImages } from '@/lib/cloudinary'
import { updateUserSettings } from '@/services/user.services'
import { TypeUserSettings } from '@/types/user-types'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const session = await auth()
		if (session) {
			const formData = await req.formData()

			const username = formData.get('username') as string
			const displayName = formData.get('displayName') as string
			const bio = formData.get('bio') as string
			const password = formData.get('password') as string

			const data: TypeUserSettings = {}
			if (username) data.username = username
			if (displayName) data.displayName = '@' + displayName
			if (bio) data.bio = bio
			if (password) data.password = password

			const image = formData.get('avatar') as File
			if (image) {
				const uploadPromises = await uploadImages([image], 1)
				const uploadResults = await Promise.all(uploadPromises)
				data.avatarUrl = uploadResults[0]
			}

			const result = await updateUserSettings(+session.user.id, data)
			if (!result) {
				throw new Error('Failed to update user settings')
			}

			return NextResponse.json(true)
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
