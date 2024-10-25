'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TypeCheckOneToOneConversation } from '@/types/chat-types'
import { useActiveConversationStore } from '@/stores/conversation.store'
import { useEffect, useRef, useState } from 'react'
import { pusherClient } from '@/lib/pusher'
import { ChatMessageList } from './chat-message-list'
import { ChatCreateMessage } from './chat-create-message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useChatMessages } from '@/hooks/useChatMessages'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'
import { Loader2 } from 'lucide-react'
import { fetchUpdateMessageStatus } from '@/services/message.services'
import { useRouter } from 'next/navigation'

export const ChatOneToOneContent: React.FC<{
	userId: number
	username: string
	data: TypeCheckOneToOneConversation
}> = ({ username, userId, data }) => {
	const {
		data: messagesData,
		hasNextPage,
		isLoading,
		isFetchingNextPage,
		fetchNextPage,
	} = useChatMessages(['conversation', data.id.toString()], data.id)

	const [messages, setMessages] = useState<
		TypeCheckOneToOneConversation['messages']
	>([])
	const [firstRenderMessage, setFirstRenderMessage] = useState(false)

	const [countPages, setCountPages] = useState<number | null>(null)

	const router = useRouter()
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
		// if (countPages !== messagesData.pages.length) {
		// 	setCountPages(messagesData.pages.length)
		// 	return
		// }
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
			{/* dark:bg-[#0f172a] */}
			<div className='bg-gray-50 dark:bg-[#272727] p-4 shadow'>
				<h2 className='text-2xl relative font-semibold flex flex-row items-center gap-3'>
					<Avatar
						onClick={() =>
							router.push(
								data.users[0].user.id === userId
									? process.env.NEXT_PUBLIC_DEFAULT_URL +
											'user/' +
											data.users[1].user.displayName.slice(1)
									: process.env.NEXT_PUBLIC_DEFAULT_URL +
											'user/' +
											data.users[0].user.displayName.slice(1)
							)
						}
						className={`w-10 h-10 hover:cursor-pointer`}
					>
						<AvatarImage
							src={
								data.users[0].user.id === userId
									? data.users[1].user.avatarUrl ||
									  process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
									: data.users[0].user.avatarUrl ||
									  process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
							}
							alt={'avatar'}
						/>
						<AvatarFallback>
							<SkeletonImg />
						</AvatarFallback>
					</Avatar>
					{data.users[0].user.id === userId &&
					data.users[1].user.active === 'ONLINE' ? (
						<span className='absolute top-[30px] left-[31px] border-white border-1 w-[10px] h-[10px] bg-green-500 rounded-full z-5' />
					) : null}
					{data.users[1].user.id === userId &&
					data.users[0].user.active === 'ONLINE' ? (
						<span className='absolute top-[30px] left-[31px] border-white border-1 w-[10px] h-[10px] bg-green-500 rounded-full z-5' />
					) : null}
					<span className='flex flex-row'>
						{data.users[0].user.id === userId
							? data.users[1].user.username
							: data.users[0].user.username}
					</span>
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
							firstRenderMessage={firstRenderMessage}
							isFetchingNextPage={isFetchingNextPage}
							fetchNextPage={fetchNextPage}
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
