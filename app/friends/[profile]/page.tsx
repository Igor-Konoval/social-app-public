import { z } from 'zod'
import { notFound } from 'next/navigation'
import { getUserFriendList } from '@/services/friend.services'
import { FriendsUserPage } from '@/components/shared'

export default async function Page({
	params,
}: {
	params: { profile: string }
}) {
	const displayNameSchema = z
		.string()
		.min(1)
		.max(30)
		.regex(/^[a-zA-Z0-9-_]+$/, 'Invalid username format')

	const parsedResult = displayNameSchema.safeParse(params.profile)
	if (!parsedResult.success) {
		return notFound()
	}

	const data = await getUserFriendList(params.profile)

	if (!data) {
		return notFound()
	}
	return <FriendsUserPage userData={data} />
}
