import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sendFriendRequest } from '@/services/friend.services'

export async function POST(req: Request) {
	try {
		const session = await auth()
		const body = await req.json()

		if (session !== null) {
			const result = await sendFriendRequest(+session.user.id, +body.friendId)

			return NextResponse.json(result)
		} else {
			NextResponse.json({ error: 'Unauthorized', status: 401 })
		}
	} catch (error) {
		NextResponse.json({ error: 'Failed to get posts' }, { status: 500 })
	}
}

export async function DELETE(req: Request) {
	try {
		const session = await auth()
		const body = await req.json()

		if (session !== null) {
			const result = await sendFriendRequest(+session.user.id, +body.friendId)
			return NextResponse.json(result)
		} else {
			NextResponse.json({ error: 'Unauthorized', status: 401 })
		}
	} catch (error) {
		NextResponse.json({ error: 'Failed to get posts' }, { status: 500 })
	}
}
