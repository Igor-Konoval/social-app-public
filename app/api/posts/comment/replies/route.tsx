import { auth } from '@/auth'
import {
	createReplyCommentPost,
	getRepliesCommentPost,
} from '@/services/post.services'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()

	const session = await auth()
	if (session !== null) {
		const data = await createReplyCommentPost(
			body.postId,
			+session.user.id,
			body.content,
			body.parentCommentId,
			body.receiverId
		)

		return NextResponse.json(data)
	} else {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams
	const query = searchParams.get('query')

	if (query !== null && !isNaN(+query)) {
		const data = await getRepliesCommentPost(+query)

		return NextResponse.json(data)
	} else {
		return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
	}
}
