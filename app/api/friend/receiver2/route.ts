import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
	acceptFriendRequest2,
	rejectFriendRequest2,
} from '@/services/friend.services'

export async function POST(req: Request) {
	try {
		const session = await auth()
		const body = await req.json()

		if (session !== null) {
			const result = await acceptFriendRequest2(+session.user.id, body.friendId)

			return NextResponse.json(result)
		} else {
			return NextResponse.json({ error: 'Unauthorized', status: 401 })
		}
	} catch (error) {
		return NextResponse.json({
			error: 'Сталася помилка на сервері',
			status: 500,
		})
	}
}

export async function DELETE(req: Request) {
	try {
		const session = await auth()
		const body = await req.json()

		if (session !== null) {
			const result = await rejectFriendRequest2(body.friendId, +session.user.id)

			return NextResponse.json(result)
		} else {
			return NextResponse.json({ error: 'Unauthorized', status: 401 })
		}
	} catch (error) {
		return NextResponse.json({
			error: 'Сталася помилка на сервері',
			status: 500,
		})
	}
}
