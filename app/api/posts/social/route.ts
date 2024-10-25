import { getPublicPosts, getAuthPublicPosts } from '@/services/post.services'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const skip = searchParams.get('skip')
		const session = await auth()
		if (session !== null) {
			const posts = await getAuthPublicPosts(
				20,
				+session.user.id,
				skip ? +skip : 0
			)

			return NextResponse.json(posts)
		} else {
			const posts = await getPublicPosts(10, skip ? +skip : 0)
			return NextResponse.json(posts)
		}
	} catch (error) {
		return NextResponse.json({ error: 'Failed to get posts' }, { status: 500 })
	}
}
