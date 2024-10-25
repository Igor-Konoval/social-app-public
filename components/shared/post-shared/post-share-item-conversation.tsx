import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TypeGetAllChatsForShare } from '@/types/chat-types'
import { Dispatch, SetStateAction } from 'react'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const PostShareItemConversation: React.FC<{
	conversations: TypeGetAllChatsForShare['conversations']
	selectedConversations: number[]
	setSelectedConversations: Dispatch<SetStateAction<number[]>>
	userId: number | undefined | null
}> = ({
	conversations,
	setSelectedConversations,
	selectedConversations,
	userId,
}) => {
	return conversations.map(chat => (
		<Card
			key={chat.id}
			onClick={() => {
				if (selectedConversations.includes(chat.id)) {
					setSelectedConversations(prev => prev.filter(id => id !== chat.id))
				} else {
					setSelectedConversations(prev => [...prev, chat.id])
				}
			}}
			className={`flex flex-col rounded-3xl items-center px-1 sm:px-4 transition-colors duration-150 hover:cursor-pointer hover:bg-slate-50 focus:bg-slate-300 ${
				selectedConversations.includes(chat.id) && 'bg-slate-300 border-sky-300'
			}`}
		>
			<CardHeader className='flex flex-col items-center p-1 pt-2'>
				{chat.users.length > 2 ? (
					<span className='w-14 h-14'>
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
											process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
										}
									/>
									<AvatarFallback><SkeletonImg /></AvatarFallback>
								</Avatar>
							) : (
								''
							)
						)}
					</span>
				) : (
					chat.users.map(user =>
						user.user.id !== userId ? (
							<>
								<Avatar key={user.user.id} className='w-16 h-16'>
									<AvatarImage
										src={
											user.user.avatarUrl ||
											process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
										}
									/>

									<AvatarFallback><SkeletonImg /></AvatarFallback>
								</Avatar>
							</>
						) : null
					)
				)}
			</CardHeader>
			<CardContent className='text-center p-0 pb-4 text-sm break-all'>
				{chat.variant === 'CONVERSATION' ? (
					<p className='font-semibold'>
						{chat.users
							.map(user => (user.user.id !== userId ? user.user.username : ''))
							.reduce((prev, username) => prev + ' ' + username, '')}
					</p>
				) : (
					<>
						<p className='font-semibold'>{chat.users[0].user.username}</p>
						<p className='text-gray-400'>{chat.users[0].user.displayName}</p>
					</>
				)}
			</CardContent>
		</Card>
	))
}
