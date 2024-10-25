import { auth } from '@/auth'
import { reactionsForPost } from '@/services/post.services'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()
	const session = await auth()

	if (session !== null) {
		const data = await reactionsForPost(
			body.postId,
			+session.user.id,
			body.reaction
		)

		return NextResponse.json(data)
	} else {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}
