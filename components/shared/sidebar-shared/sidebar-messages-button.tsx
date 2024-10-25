'use client'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { pusherClient } from '@/lib/pusher'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useActiveConversationStore } from '@/stores/conversation.store'
import { useUnreadMessagesStore } from '@/stores/messages.store'

export const SidebarMessagesButton: React.FC<{
	countMessagesUnread: number
	isMobile?: boolean
	userId: string
}> = ({ countMessagesUnread, isMobile, userId }) => {
	const unreadMessages = useUnreadMessagesStore(state => state.unreadMessages)
	const setUnreadMessages = useUnreadMessagesStore(
		state => state.setUnreadMessages
	)
	const incrementUnreadMessages = useUnreadMessagesStore(
		state => state.incrementUnreadMessages
	)
	const conversationId = useActiveConversationStore(
		state => state.conversationId
	)

	useEffect(() => {
		if (isMobile) return
		if (countMessagesUnread === undefined) return
		setUnreadMessages(countMessagesUnread)
	}, [])

	useEffect(() => {
		if (isMobile) return
		const channelName = 'conversation-' + userId
		const channel = pusherClient.subscribe(channelName)
		channel.bind('push-message', handleMessage)

		function handleMessage(data: any) {
			if (data.conversationId === conversationId) return
			// setUnreadMessages(unreadMessages + 1)
			incrementUnreadMessages()
			toast({
				title: 'Ви отримали нове повідомлення',
				duration: 3500,
				className:
					'bg-white border border-slate-200 top-0 md:top-auto md:bottom-0',
				description: data.content || 'Перевірте сторінку чатів',
			})
		}

		return () => {
			channel.unbind('push-message', handleMessage)
			pusherClient.unsubscribe(channelName)
		}
	}, [conversationId, userId])

	return (
		<Link
			href={process.env.NEXT_PUBLIC_DEFAULT_URL + 'messages'}
			className='flex items-center gap-2'
			// onClick={clearUnreadMessages}
		>
			<MessageCircle /> {'Messages'}
			{!!unreadMessages && <Badge variant='secondary'>{unreadMessages}</Badge>}
		</Link>
	)
}
