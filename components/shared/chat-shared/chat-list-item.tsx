'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { timeAgo } from '@/components/ui/time-ago'
import { Title } from '@/components/ui/title'
import { TypeGetAllChats } from '@/types/chat-types'
import { useRouter } from 'next/navigation'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'
import { useUnreadMessagesStore } from '@/stores/messages.store'

export const ChatListItem: React.FC<{
	chat: TypeGetAllChats[0]
	userId: number
}> = ({ chat, userId }) => {
	const router = useRouter()
	const userMessageStatus = chat.users.find(user => user.user.id === userId)
	const dicrementUnreadMessages = useUnreadMessagesStore(
		state => state.dicrementUnreadMessages
	)
	return (
		<Card
			onClick={() => {
				if (userMessageStatus?.messageStatus === 'UNREAD') {
					dicrementUnreadMessages()
				}
				chat.variant === 'CONVERSATION'
					? router.push(`/messages/${chat.id}`)
					: router.push(`/messages/t/${chat.id}`)
			}}
			key={chat.id}
			className='w-full dark:bg-[#212121] border-none hover:cursor-pointer shadow-none'
		>
			{!!chat.messages.length && (
				<CardContent className='flex relative flex-row border-b-0 gap-4 pt-2 pb-1'>
					{chat.users.length > 2 ? (
						<div className='min-w-14 min-h-14'>
							{chat.users.map((user, index) =>
								user.user.id !== userId && index <= 4 ? (
									<Avatar
										className={`w-7 h-7 relative ${
											index === 1
												? 'top-0 left-0'
												: index === 2
												? 'left-[28px] top-[-28px]'
												: index === 3
												? 'top-[-28px]'
												: index === 4
												? 'left-[28px] top-[-56px]'
												: ''
										}`}
										key={user.user.id}
									>
										<AvatarImage
											src={
												user.user.avatarUrl ||
												process.env.NEXT_PUBLIC_DEFAULT_URL +
													'avatar-unknown.jpg'
											}
										/>
										<AvatarFallback>
											<SkeletonImg />
										</AvatarFallback>
									</Avatar>
								) : (
									''
								)
							)}
						</div>
					) : (
						chat.users.map(user =>
							user.user.id !== userId ? (
								<>
									<Avatar key={user.user.id} className='w-14 h-14'>
										<AvatarImage
											src={
												user.user.avatarUrl ||
												process.env.NEXT_PUBLIC_DEFAULT_URL +
													'avatar-unknown.jpg'
											}
										/>

										<AvatarFallback>
											<SkeletonImg />
										</AvatarFallback>
									</Avatar>
									{user.user.active === 'ONLINE' ? (
										<span className='absolute top-[52px] left-[65px] border-white border-1 w-[10px] h-[10px] bg-green-500 rounded-full z-5' />
									) : null}
								</>
							) : null
						)
					)}
					<div className='flex flex-col'>
						<Title
							className='font-semibold dark:text-white'
							text={chat.users
								.map(user =>
									user.user.id !== userId ? user.user.username : ''
								)
								.reduce((prev, username) => prev + ' ' + username, '')}
						/>
						<div className='flex flex-row items-center gap-4'>
							<p
								className={`pt-[3px]  break-all ${
									userMessageStatus?.messageStatus === 'UNREAD'
										? 'font-bold text-[18px] text-[#00687b] dark:text-[#91bbe7]'
										: 'text-[#747373] dark:text-[#bbbbbb]'
								}`}
							>
								{chat.messages.length > 0 &&
									(() => {
										const message = chat.messages[0]
										const isCurrentUser = message.user.id === userId
										const username = isCurrentUser
											? 'Ви'
											: message.user.username

										switch (message.messageVariant) {
											case 'TEXT':
												return `${username}: ${
													message.content.length > 18
														? message.content.substring(0, 18) + '...'
														: message.content
												}`
											case 'POST':
												return isCurrentUser
													? 'Ви поділилися постом'
													: `${message.user.username} поділився постом`
											case 'IMAGE':
												return isCurrentUser
													? 'Ви поділилися зображенням'
													: `${message.user.username} поділився зображенням`
											default:
												return null
										}
									})()}
							</p>
							<p className='text-[12px] flex flex-row dark:text-[#bbbbbb] items-center gap-1 text-muted-foreground'>
								{/* {formatNoStaticDate(chat.messages[0].createdAt)}
								 */}
								{timeAgo(chat.messages[0].createdAt)}
								{userMessageStatus?.messageStatus === 'UNREAD' ? (
									<span className='w-[10px] h-[10px] rounded-full bg-[#00687b] dark:bg-[#91bbe7]' />
								) : null}
							</p>
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	)
}
