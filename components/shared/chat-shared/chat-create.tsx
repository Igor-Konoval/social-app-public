'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerClose,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchOneToOneConversation } from '@/services/message.services'
import { TypeGetChatFriendList } from '@/types/chat-types'
import { MessageCircleMoreIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const ChatCreate: React.FC<{
	chatFriendList: TypeGetChatFriendList
}> = ({ chatFriendList }) => {
	const router = useRouter()

	return (
		<Drawer>
			<DrawerTrigger className='flex flex-row gap-2 text-md [@media(min-width:450px)]:text-lg items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-2 [@media(min-width:450px)]:px-4 py-2'>
				Написати{' '}
				<MessageCircleMoreIcon className='w-5 [@media(min-width:450px)]:w-6 h-5 [@media(min-width:450px)]:h-6' />
			</DrawerTrigger>
			<DrawerContent className='flex flex-col justify-center items-center bg-white h-[65%]'>
				<DrawerHeader className='max-w-[600px] break-all'>
					<DrawerTitle className='mt-2 '>
						Виберіть користувача щоб написати йому
					</DrawerTitle>
					<DrawerDescription>
						Потім ви зможете побачити ваш чат з користувачем
					</DrawerDescription>
				</DrawerHeader>
				{/* <div className='w-[600px] grid grid-cols-4 gap-4 mt-4'> */}
				<ScrollArea type='always'>
					<div className='max-w-[600px] grid overflow-y-auto grid-cols-3 sm:grid-cols-4 mr-[2px] px-2 sm:px-4 gap-2 sm:gap-4 mt-4'>
						{chatFriendList ? (
							<>
								{chatFriendList.friends.map(friend => (
									<Card
										key={friend.id}
										onClick={async () => {
											const result = await fetchOneToOneConversation(
												friend.user.id
											)
											if (result) {
												router.push(
													process.env.NEXT_PUBLIC_DEFAULT_URL +
														'/messages/t/' +
														result.id
												)
											}
										}}
										className='flex flex-col rounded-3xl items-center px-1 sm:px-4 transition-colors duration-150 hover:cursor-pointer hover:bg-slate-50'
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
								{chatFriendList.friendOf.map(friend => (
									<Card
										key={friend.id}
										onClick={async () => {
											const result = await fetchOneToOneConversation(
												friend.friend.id
											)
											if (result) {
												router.push(
													process.env.NEXT_PUBLIC_DEFAULT_URL +
														'/messages/t/' +
														result.id
												)
											}
										}}
										className='flex flex-col rounded-3xl items-center px-1 sm:px-4 transition-colors duration-150 hover:cursor-pointer hover:bg-slate-50'
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
												<AvatarFallback>
													<SkeletonImg />
												</AvatarFallback>
											</Avatar>
										</CardHeader>
										<CardContent className='text-center p-0 pb-4 text-sm break-all'>
											<p className='font-semibold'>{friend.friend.username}</p>
											<p className='text-gray-400'>
												{friend.friend.displayName}
											</p>
										</CardContent>
									</Card>
								))}
							</>
						) : (
							<p>no friends</p>
						)}
					</div>
				</ScrollArea>
				<DrawerFooter className='w-[300px]'>
					<DrawerClose>
						<Button>Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
