'use client'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TypeCheckOneToOneConversation } from '@/types/chat-types'
import { memo, useEffect, useRef, useState } from 'react'
import { ChatMessageVariantPost } from './chat-message-variant-post'
import { Loader2, SendHorizonal } from 'lucide-react'
import { ChatMessageVariantImage } from './chat-message-variant-image'
import { useInView } from 'react-intersection-observer'
import {
	FetchNextPageOptions,
	InfiniteData,
	InfiniteQueryObserverResult,
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export const ChatMessageList = memo<{
	messages: TypeCheckOneToOneConversation['messages']
	userId: number
	hasNextPage: boolean
	isFetchingNextPage: boolean
	firstRenderMessage: boolean
	fetchNextPage: (
		options?: FetchNextPageOptions
	) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}>(
	({
		messages,
		userId,
		hasNextPage,
		isFetchingNextPage,
		firstRenderMessage,
		fetchNextPage,
	}) => {
		const [prevCount, setPrevCount] = useState(0)

		const { ref, inView, entry } = useInView({ threshold: 0.5 })
		const refMessageTrigger = useRef<HTMLDivElement>(null)

		const router = useRouter()

		useEffect(() => {
			if (firstRenderMessage === false || isFetchingNextPage) return

			if (entry && inView && hasNextPage) {
				fetchNextPage().then(() => {
					if (refMessageTrigger.current && firstRenderMessage) {
						refMessageTrigger.current.scrollIntoView({ behavior: 'instant' })
					}
				})
			}
		}, [entry, inView, hasNextPage])

		useEffect(() => {
			setPrevCount(messages.length)
		}, [])

		return (
			<div className='pb-14'>
				{firstRenderMessage === true ? <span ref={ref} /> : null}
				{isFetchingNextPage && (
					<div className='flex justify-center w-full h-[100px]'>
						<Loader2 className='w-14 h-14 animate-spin' />
					</div>
				)}
				{messages.map((message, index) => (
					<div
						ref={index === 0 ? refMessageTrigger : null}
						id={
							index === messages.length - 1 && message.user.id === userId
								? 'last-message'
								: undefined
						}
						key={message.id}
						className={`flex ${
							message.user.id !== userId ? 'justify-start' : 'justify-end'
						} ${
							messages.length === prevCount
								? ''
								: index === messages.length - 1
								? message.user.id !== userId
									? 'animate-slide-in-left'
									: 'animate-slide-in-right'
								: ''
						} my-3 max-w-full md:max-w-[600px]`}
					>
						<div
							className={`flex ${
								message.user.id !== userId ? 'flex-row' : 'flex-row-reverse'
							} items-start gap-2 max-w-[90%] [@media(min-width:400px)]:max-w-[70%]`}
						>
							<Avatar
								onClick={() =>
									router.push(
										process.env.NEXT_PUBLIC_DEFAULT_URL +
											'user/' +
											message.user.displayName.slice(1)
									)
								}
								className={`w-10 h-10 hover:cursor-pointer ${
									message.user.id !== userId ? 'ml-3' : 'mr-3'
								}`}
							>
								<AvatarImage
									src={
										message.user.avatarUrl ||
										process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
									}
									alt={message.user.username}
								/>
								<AvatarFallback>
									{message.user.username.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div
								// dark:bg-[#1f0a27]
								// 'dark:bg-[#1e293b]'
								className={`rounded-lg border bg-white ${
									message.user.id !== userId
										? 'dark:bg-[#242425]'
										: 'dark:bg-[#2d4347]'
								} border-gray-100 dark:ring-slate-900/5 dark:border-gray-600 ${
									message.messageVariant === 'TEXT' ? 'p-3' : ''
								} pb-0 break-all`}
							>
								{message.messageVariant === 'TEXT' ? (
									<p className='mb-1'>{message.content}</p>
								) : message.messageVariant === 'IMAGE' ? (
									<ChatMessageVariantImage
										imageUrl={message.imageUrl}
										content={message.content}
									/>
								) : message.messageVariant === 'POST' ? (
									<ChatMessageVariantPost
										postUsername={message.postUsername}
										postUserAvatarUrl={message.postUserAvatarUrl}
										postId={message.postId}
										content={message.content}
										imageUrl={message.imageUrl}
									/>
								) : null}
								{message.messageVariant === 'TEXT' ? (
									<span className='text-[10px] text-gray-500 dark:text-gray-400'>
										{format(new Date(message.createdAt), 'HH:mm, dd MMM yyyy')}
									</span>
								) : null}
							</div>
							{message.messageVariant !== 'TEXT' ? (
								message.user.id === userId ? (
									<span className='text-center flex flex-row items-end gap-1 h-[50%] text-[10px] text-gray-500 dark:text-gray-400'>
										{format(new Date(message.createdAt), 'HH:mm, dd MMM yyyy')}{' '}
										<SendHorizonal className='w-5 h-5' />
									</span>
								) : (
									<span className='text-center flex flex-row items-end gap-1 h-[50%] text-[10px] text-gray-500 dark:text-gray-400'>
										<SendHorizonal className='w-5 h-5' />{' '}
										{format(new Date(message.createdAt), 'HH:mm, dd MMM yyyy')}
									</span>
								)
							) : null}
						</div>
					</div>
				))}
			</div>
		)
	},
	(prevProps, nextProps) =>
		prevProps.isFetchingNextPage === nextProps.isFetchingNextPage &&
		prevProps.firstRenderMessage === nextProps.firstRenderMessage &&
		prevProps.messages.length === nextProps.messages.length &&
		prevProps.userId === nextProps.userId
)
