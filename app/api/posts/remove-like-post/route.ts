import { auth } from '@/auth'
import { removeReaction } from '@/services/post.services'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
	const body = await req.json()
	const session = await auth()

	if (session !== null) {
		const data = await removeReaction(body.postId, +session.user.id)
		return NextResponse.json(data)
	} else {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}
