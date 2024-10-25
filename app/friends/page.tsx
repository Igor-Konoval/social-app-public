import { auth } from '@/auth'
import { FriendsPage } from '@/components/shared'
import { getFriendList, getRequestFriendList } from '@/services/friend.services'
import { redirect } from 'next/navigation'

export default async function Page() {
	const session = await auth()

	if (!session) {
		return redirect(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
	}

	const friendList = await getFriendList(+session.user.id)
	const requestFriendList = await getRequestFriendList(+session.user.id)

	return (
		<FriendsPage
			requestFriendList={requestFriendList}
			friendList={friendList}
		/>
	)
}
