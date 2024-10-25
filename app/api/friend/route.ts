import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { acceptFriendRequest } from '@/services/friend.services'

export async function POST(req: Request) {
	const session = await auth()
	const body = await req.json()

	if (session !== null) {
	const result = await acceptFriendRequest(body.friendId, +session.user.id)
	return NextResponse.json(result)
	}
}
