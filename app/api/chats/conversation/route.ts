import { auth } from '@/auth'
import { conversation, conversationMessages } from '@/services/message.services'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const skip = searchParams.get('skip')
		const conversationId = searchParams.get('conversationId')
		if (skip === null || conversationId === null) {
			return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
		}
		const session = await auth()
		if (session !== null) {
			const result = await conversationMessages(
				+session.user.id,
				+conversationId,
				+skip
			)

			return NextResponse.json(result?.reverse())
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
		if (session !== null) {
			const body = await req.json()
			const result = await conversation(+session.user.id, body.friendsId)

			return NextResponse.json({ id: result.id })
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
