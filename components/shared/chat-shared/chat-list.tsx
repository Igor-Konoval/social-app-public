'use client'
import { TypeGetAllChats } from '@/types/chat-types'
import { ChatListItem } from './chat-list-item'
import { useChat } from '@/hooks/useChat'
import { useEffect } from 'react'
import { useUnreadMessagesStore } from '@/stores/messages.store'

export const ChatList: React.FC<{
	initialData: TypeGetAllChats
	userId: number
}> = ({ initialData, userId }) => {
	const { data: chats } = useChat(userId, initialData)
	const clearUnreadMessages = useUnreadMessagesStore(
		state => state.clearUnreadMessages
	)

	useEffect(() => {
		clearUnreadMessages()
	}, [])

	return (
		(chats as TypeGetAllChats) &&
		(chats as TypeGetAllChats).map(chat =>
			chat.variant === 'ONETOONE' && chat.messages.length > 0 ? (
				<ChatListItem
					key={chat.id + Math.random()}
					chat={chat}
					userId={userId}
				/>
			) : chat.variant === 'CONVERSATION' ? (
				<ChatListItem
					key={chat.id + Math.random()}
					chat={chat}
					userId={userId}
				/>
			) : null
		)
	)
}
