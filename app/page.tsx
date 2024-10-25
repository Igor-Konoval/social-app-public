import { auth } from '@/auth'
import { Main } from '@/components/shared'
import { getAuthPublicPosts, getPublicPosts } from '@/services/post.services'

export default async function Home() {
	const session = await auth()

	if (session?.user) {
		const data = await getAuthPublicPosts(20, +session.user.id, 0)

		return <Main className='w-fit' posts={data} />
	} else {
		const data = await getPublicPosts(20, 0)
		return (
			<Main
				className='w-fit'
				status={session !== null ? 'authenticated' : 'unauthenticated'}
				posts={data}
			/>
		)
	}
}
