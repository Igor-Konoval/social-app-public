import { auth } from '@/auth'
import { updateMessageStatus } from '@/services/message.services'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const session = await auth()
		const body = await req.json()
		if (session !== null) {
			const res = await updateMessageStatus(
				body.conversationId,
				+session.user.id
			)
			return NextResponse.json(res)
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
