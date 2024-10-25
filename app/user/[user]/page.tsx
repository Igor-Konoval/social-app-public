import { z } from 'zod'
import { auth } from '@/auth'
import {
	AuthUserProfile,
	OwnerUserProfile,
	UserProfile,
} from '@/components/shared'
import {
	getAuthUserByDisplayName,
	getUserByDisplayName,
	getUsers,
} from '@/services/user.services'
import { getSavedPosts } from '@/services/post.services'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
	const users = await getUsers()

	return users.map(user => ({
		user: user.displayName.slice(1),
	}))
}

export async function generateMetadata({
	params,
}: {
	params: { user: string }
}): Promise<Metadata> {
	const displayNameSchema = z
		.string()
		.min(1)
		.max(30)
		.regex(/^[a-zA-Z0-9-_]+$/, 'Invalid username format')
	const parsedResult = displayNameSchema.safeParse(params.user)
	if (!parsedResult.success) {
		return {
			title: 'Не існує',
		}
	}

	const user = await getUserByDisplayName(params.user)
	if (!user) {
		return {
			title: 'Не існує',
		}
	}

	return {
		title: `Lin-Social - профіль користувача ${user.displayName}`,
		description: `${
			user.bio
				? user.bio.length > 70
					? user.bio.substring(0, 70) + '...'
					: user.bio
				: 'Натисніть, щоб перейти на профіль користувача соціальної мережі Lin-Social'
		}`,
		openGraph: {
			images: [
				{
					url: user.avatarUrl
						? user.avatarUrl
						: process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg',
				},
			],
		},
	}
}

export default async function Page({ params }: { params: { user: string } }) {
	const displayNameSchema = z
		.string()
		.min(1)
		.max(30)
		.regex(/^[a-zA-Z0-9-_]+$/, 'Invalid username format')
	const parsedResult = displayNameSchema.safeParse(params.user)
	if (!parsedResult.success) {
		return notFound()
	}

	const session = await auth()
	if (session?.user) {
		const authUser = await getAuthUserByDisplayName(
			params.user,
			+session?.user.id
		)

		if (authUser === false) {
			return notFound()
		}

		if (+session?.user.id === authUser.id) {
			const savedPosts = await getSavedPosts(+session?.user.id)

			return <OwnerUserProfile savedPosts={savedPosts} user={authUser} />
		} else {
			return <AuthUserProfile user={authUser} />
		}
	} else {
		const user = await getUserByDisplayName(params.user)
		if (!user) {
			return notFound()
		}

		return <UserProfile user={user} />
	}
}
