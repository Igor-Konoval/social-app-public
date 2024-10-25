import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAllChatsForShare } from '@/services/message.services'
import { postShare } from '@/services/post.services'

export async function GET() {
	try {
		const session = await auth()
		if (session !== null) {
			const posts = await getAllChatsForShare(+session.user.id)
			return NextResponse.json(posts)
		} else {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
	} catch (error) {
		NextResponse.json({ error: 'Failed to share post' }, { status: 500 })
	}
}

export async function POST(req: Request) {
	try {
		const session = await auth()
		if (session !== null) {
			const body = await req.json()
			const result = await postShare(
				+body.postId,
				+session.user.id,
				body.content,
				body.conversationIds,
				body.friendIds,
				body.imageUrl,
				body.postUsername,
				body.postUserAvatarUrl
			)
			return NextResponse.json(result)
		} else {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
	} catch (error) {
		NextResponse.json({ error: 'Failed to share post' }, { status: 500 })
	}
}
