import { z } from 'zod'
import { getAllPostIds, getPostById } from '@/services/post.services'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/shared'
import { Metadata } from 'next'

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
	const postIds = await getAllPostIds()

	return postIds.map(post => ({
		id: post.id.toString(),
	}))
}

export async function generateMetadata({
	params,
}: {
	params: { id: string }
}): Promise<Metadata> {
	if (isNaN(+params.id)) {
		return notFound()
	}
	const post = await getPostById(+params.id)
	if (!post) {
		return {
			title: 'Не існує',
		}
	}

	return {
		title: `Lin-Social - пост користувача ${post.user.displayName}`,
		description: `${
			post.content.length > 70
				? post.content.substring(0, 70) + '...'
				: post.content
		}`,
		openGraph: {
			images: [
				{
					url:
						post.imageUrl.length !== 0
							? post.imageUrl[0]
							: post.user.avatarUrl
							? post.user.avatarUrl
							: '',
				},
			],
		},
	}
}

export default async function Page({ params }: { params: { id: string } }) {
	if (isNaN(+params.id)) {
		return notFound()
	}
	const post = await getPostById(+params.id)
	if (!post) {
		return notFound()
	}

	return (
		<div className='flex justify-center lg:justify-start pt-3'>
			<PostCard {...post} />
		</div>
	)
}
