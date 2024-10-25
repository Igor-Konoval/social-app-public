import {
	getFriendList,
	getRequestFriendList,
	getUserFriendList,
} from '@/services/friend.services'

export type TypeFriendList = Awaited<ReturnType<typeof getFriendList>>
export type TypeRequestFriendList = Awaited<
	ReturnType<typeof getRequestFriendList>
>

export type TypeGetUserFriendList = Awaited<
	ReturnType<typeof getUserFriendList>
>
