import { auth } from '@/auth'
import { addSavePost, removeSavePost } from '@/services/post.services'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()
	const session = await auth()

	if (session !== null) {
		const data = await addSavePost(body.postId, +session.user.id)
		return NextResponse.json(data)
	} else {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}

export async function DELETE(req: Request) {
	const body = await req.json()
	const session = await auth()

	if (session !== null) {
		const data = await removeSavePost(body.postId, +session.user.id)
		return NextResponse.json(data)
	} else {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
}
