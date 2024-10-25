import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TypeGetAllChatsForShare } from '@/types/chat-types'
import { Dispatch, SetStateAction } from 'react'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const PostShareItemFriends: React.FC<{
	friends: TypeGetAllChatsForShare['friends']
	selectedUsers: number[]
	setSelectedUsers: Dispatch<SetStateAction<number[]>>
}> = ({ friends, selectedUsers, setSelectedUsers }) => {
	return (
		<>
			{friends !== null &&
				friends.friends.map(friend => (
					<Card
						key={friend.id}
						onClick={() => {
							if (selectedUsers.includes(friend.user.id)) {
								setSelectedUsers(prev =>
									prev.filter(id => id !== friend.user.id)
								)
							} else {
								setSelectedUsers(prev => [...prev, friend.user.id])
							}
						}}
						className={`flex flex-col rounded-3xl items-center pl-1 pr-1 sm:px-4 transition-colors duration-150 hover:cursor-pointer hover:bg-slate-50 focus:bg-slate-300 ${
							selectedUsers.includes(friend.user.id) &&
							'bg-slate-300 border-sky-300'
						}`}
					>
						<CardHeader className='flex flex-col items-center p-1 pt-2'>
							<Avatar className='w-16 h-16'>
								<AvatarImage
									src={
										friend.user.avatarUrl
											? friend.user.avatarUrl
											: process.env.NEXT_PUBLIC_DEFAULT_URL +
											  'avatar-unknown.jpg'
									}
									alt='User avatar'
								/>
								<AvatarFallback>
									<SkeletonImg />
								</AvatarFallback>
							</Avatar>
						</CardHeader>
						<CardContent className='text-center p-0 pb-4 text-sm break-all'>
							<p className='font-semibold'>{friend.user.username}</p>
							<p className='text-gray-400'>{friend.user.displayName}</p>
						</CardContent>
					</Card>
				))}
			{friends !== null &&
				friends.friendOf.map(friend => (
					<Card
						key={friend.id}
						onClick={() => {
							if (selectedUsers.includes(friend.friend.id)) {
								setSelectedUsers(prev =>
									prev.filter(id => id !== friend.friend.id)
								)
							} else {
								setSelectedUsers(prev => [...prev, friend.friend.id])
							}
						}}
						className={`flex flex-col rounded-3xl items-center px-1 sm:px-4 transition-colors duration-150 hover:cursor-pointer hover:bg-slate-50 focus:bg-slate-300 ${
							selectedUsers.includes(friend.friend.id) &&
							'bg-slate-300 border-sky-300'
						}`}
					>
						<CardHeader className='flex flex-col items-center p-1 pt-2'>
							<Avatar className='w-16 h-16'>
								<AvatarImage
									src={
										friend.friend.avatarUrl
											? friend.friend.avatarUrl
											: process.env.NEXT_PUBLIC_DEFAULT_URL +
											  'avatar-unknown.jpg'
									}
									alt='User avatar'
								/>
								<AvatarFallback><SkeletonImg /></AvatarFallback>
							</Avatar>
						</CardHeader>
						<CardContent className='text-center p-0 pb-4 text-sm break-all'>
							<p className='font-semibold'>{friend.friend.username}</p>
							<p className='text-gray-400'>{friend.friend.displayName}</p>
						</CardContent>
					</Card>
				))}
		</>
	)
}
