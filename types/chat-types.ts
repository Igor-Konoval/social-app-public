import { getChatFriendList } from '@/services/friend.services'
import {
	checkOneToOneConversation,
	getAllChats,
	getAllChatsForShare,
} from '@/services/message.services'

export type TypeGetChatFriendList = Awaited<
	ReturnType<typeof getChatFriendList>
>
export type TypeGetAllChats = Awaited<ReturnType<typeof getAllChats>>

export type TypeCheckOneToOneConversation = Exclude<
	Awaited<ReturnType<typeof checkOneToOneConversation>>,
	null
>

export type TypeGetAllChatsForShare = Awaited<
	ReturnType<typeof getAllChatsForShare>
>
