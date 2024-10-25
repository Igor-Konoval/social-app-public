import { auth } from '@/auth'
import { ChatPage } from '@/components/shared'
import { getChatFriendList } from '@/services/friend.services'
import { getAllChats } from '@/services/message.services'
import { redirect } from 'next/navigation'

export default async function Page() {
	const session = await auth()

	if (!session) {
		return redirect(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
	}

	const chatFriendList = await getChatFriendList(+session.user.id)
	if (chatFriendList) {
		chatFriendList.friends.map(item => ({
			...item,
			userId: item.friendId,
			friendId: item.userId,
		}))
	}

	const chats = await getAllChats(+session.user.id)

	return (
		<ChatPage
			userId={+session.user.id}
			initialData={chats}
			chatFriendList={chatFriendList}
		/>
	)
}
