import { auth } from '@/auth'
import { getFriendPosts } from '@/services/post.services'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const skip = searchParams.get('skip')
		const session = await auth()
		if (session !== null) {
			const posts = await getFriendPosts(20, +session.user.id, skip ? +skip : 0)

			return NextResponse.json(posts)
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
