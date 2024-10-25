'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TypeCheckOneToOneConversation } from '@/types/chat-types'
import { useActiveConversationStore } from '@/stores/conversation.store'
import { useEffect, useRef, useState } from 'react'
import { pusherClient } from '@/lib/pusher'
import { ChatMessageList } from './chat-message-list'
import { ChatCreateMessage } from './chat-create-message'
import { useChatConversationMessages } from '@/hooks/useChatConversationMessages'
import { Loader2 } from 'lucide-react'
import { fetchUpdateMessageStatus } from '@/services/message.services'

export const ChatConversationContent: React.FC<{
	userId: number
	username: string
	data: TypeCheckOneToOneConversation
}> = ({ username, userId, data }) => {
	const {
		data: messagesData,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		fetchNextPage,
	} = useChatConversationMessages(
		['conversation', data.id.toString()],
		data.id
		// data.messages
	)

	const [messages, setMessages] = useState<
		TypeCheckOneToOneConversation['messages']
	>([])
	const [firstRenderMessage, setFirstRenderMessage] = useState(false)
	// const [countPages, setCountPages] = useState(messagesData.pages.length)
	const [countPages, setCountPages] = useState<number | null>(null)

	const clearConversationId = useActiveConversationStore(
		state => state.clearConversationId
	)
	const setConversationId = useActiveConversationStore(
		state => state.setConversationId
	)

	useEffect(() => {
		if (messagesData !== undefined) {
			if (messages.length !== 0) {
				setMessages(prevMessages => [
					...messagesData.pages[messagesData.pages.length - 1].flat(),
					...prevMessages,
				])
			} else {
				setMessages(messagesData.pages.flat())
			}
			setCountPages(messagesData.pages.length)
		}
	}, [messagesData])

	function handlePusherConversation(data: any) {
		setMessages(prevData => [...prevData, data.message])
	}

	useEffect(() => {
		setConversationId(data.id)
		const channelName = 'conversation-' + data.id
		const channel = pusherClient.subscribe(channelName)
		channel.bind('send-message', handlePusherConversation)

		const updateStatus = async () => {
			await fetchUpdateMessageStatus(data.id)
		}
		const handleUnload = () => {
			navigator.sendBeacon(
				process.env.NEXT_PUBLIC_DEFAULT_URL + 'api/chats/message/status',
				JSON.stringify({ conversationId: data.id })
			)
		}

		window.addEventListener('unload', handleUnload)

		return () => {
			channel.unbind('send-message', handlePusherConversation)
			pusherClient.unsubscribe(channelName)
			clearConversationId()
			updateStatus()
			window.removeEventListener('unload', handleUnload)
		}
	}, [])

	useEffect(() => {
		const lastMessage = document.getElementById('last-message')
		if (lastMessage) {
			lastMessage.addEventListener('animationend', () => {
				requestAnimationFrame(() => {
					lastMessage.scrollIntoView({
						behavior: 'smooth',
					})
				})
			})
		}
	}, [messages])

	const scrollAreaRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (firstRenderMessage) return
		if (scrollAreaRef.current) {
			const scrollableNode = scrollAreaRef.current.querySelector(
				'[data-radix-scroll-area-viewport]'
			)
			if (scrollableNode) {
				scrollableNode.scrollTop = scrollableNode.scrollHeight
				setTimeout(() => setFirstRenderMessage(true), 1500)
			}
		}
	}, [messages])

	return (
		<div
			key={data.id}
			className='flex flex-col h-[calc(100vh-50px)] md:h-[90vh] bg-[#ededed] dark:bg-[#1c1a1a] text-sm max-w-full md:max-w-[600px] rounded-lg overflow-hidden'
		>
			<div className='bg-gray-50 dark:bg-[#272727] p-4 shadow'>
				<h2 className='text-lg [@media(min-width:450px)]:text-2xl font-semibold'>
					Чат з{' '}
					{data.users
						.filter(user => user.id !== userId)
						.reduce((prev, current) => prev + ' ' + current.user.username, '')}
				</h2>
			</div>
			<div className='flex-1 overflow-hidden'>
				<ScrollArea ref={scrollAreaRef} type='always' className='h-full'>
					{isLoading ? (
						<div className='flex justify-center mt-[50%] w-full h-full'>
							<Loader2 className='w-14 h-14 animate-spin' />
						</div>
					) : (
						<ChatMessageList
							hasNextPage={hasNextPage}
							isFetchingNextPage={isFetchingNextPage}
							fetchNextPage={fetchNextPage}
							firstRenderMessage={firstRenderMessage}
							messages={messages}
							userId={userId}
						/>
					)}
				</ScrollArea>
			</div>
			<ChatCreateMessage userId={userId} username={username} data={data} />
		</div>
	)
}
