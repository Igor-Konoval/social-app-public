'use client'
import { TypeFriendList, TypeRequestFriendList } from '@/types/friend.types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { $Enums } from '@prisma/client'
import { Crown, Frown, UserCheck, UserSearch } from 'lucide-react'
import { FriendButton } from './friend-button'
import { useState } from 'react'
import Link from 'next/link'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const FriendList: React.FC<{
	friendList?: TypeFriendList
	requestFriendList?: TypeRequestFriendList
}> = ({ friendList, requestFriendList }) => {
	const [localFriendList, setLocalFriendList] = useState<
		TypeFriendList | undefined
	>(friendList)
	const [localRequestFriendList, setLocalRequestFriendList] =
		useState<TypeRequestFriendList>(requestFriendList)

	const updateRequestFriendList = (arg: any, method: 'add' | 'remove') => {
		if (method === 'add') {
			if (localFriendList) {
				setLocalFriendList(prevList => (prevList ? [...prevList, arg] : [arg]))
			}
			if (localRequestFriendList) {
				setLocalRequestFriendList(prevList =>
					prevList ? prevList.filter(el => el.userId !== arg.userId) : []
				)
			}
		}
		if (method === 'remove') {
			if (localRequestFriendList) {
				setLocalFriendList(prevList =>
					prevList ? prevList.filter(el => el.userId !== arg.userId) : []
				)
			}
		}
	}

	const updateFriendList = (friendId: number, method: 'remove') => {
		if (localFriendList) {
			if (method === 'remove') {
				if (localFriendList.length === 1) {
					setLocalFriendList([])
				} else {
					setLocalFriendList(
						localFriendList.filter(el => el.friendId !== friendId)
					)
				}
			}
		}
	}

	if (friendList === undefined && requestFriendList?.length === 0) {
		return (
			<div className='mt-[30%] text-center text-2xl text-gray-400 flex justify-center flex-col items-center gap-2'>
				Запитів немає
				<Frown size={80} color='#545454' strokeWidth={1.75} />
			</div>
		)
	}

	if (requestFriendList === undefined && friendList?.length === 0) {
		return (
			<div className='mt-[30%] text-center text-2xl text-gray-400 flex justify-center flex-col items-center gap-2'>
				Друзів немає
				<Frown size={80} color='#545454' strokeWidth={1.75} />
			</div>
		)
	}

	return (
		<>
			{localFriendList &&
				!localRequestFriendList &&
				localFriendList.map((friend, i) => (
					<Card
						key={i}
						className='rounded-none dark:bg-[#212121] border-none flex flex-row justify-between gap-4 [@media(max-width:500px)]:gap-0'
					>
						<CardHeader className='[@media(max-width:500px)]:pl-2'>
							<Link
								href={
									process.env.NEXT_PUBLIC_DEFAULT_URL +
									'user/' +
									friend.friend.displayName.slice(1)
								}
							>
								<div className='flex flex-nowrap relative flex-row items-center gap-3'>
									<Avatar className='w-24 h-24 [@media(max-width:500px)]:w-[68px] [@media(max-width:500px)]:h-[68px]'>
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
									{friend.friend.active === 'ONLINE' ? (
										<span className='absolute top-[82px] left-[73px] [@media(max-width:500px)]:top-[58px] [@media(max-width:500px)]:left-[54px] border-white border-1 w-[12px] h-[12px] bg-green-500 rounded-full z-5' />
									) : null}
									<div className='flex flex-col space-y-1 break-all'>
										<div className='flex flex-row gap-2'>
											<h1 className='text-2xl dark:text-white [@media(max-width:500px)]:text-lg font-bold flex flex-row items-center gap-2'>
												{friend.friend.username}
												{friend.status === 'ACCEPTED' ? (
													<UserCheck className='w-6 h-6' />
												) : (
													<UserSearch className='w-6 h-6' />
												)}
											</h1>

											{friend.friend.status === $Enums.UserStatus['VIP'] && (
												<Badge
													variant='secondary'
													className='flex items-center gap-1'
												>
													<Crown className='w-4 h-4' />
													<span className='[@media(max-width:900px)]:hidden'>
														VIP
													</span>
												</Badge>
											)}
										</div>
										<h1 className='text-lg [@media(max-width:500px)]:text-sm text-muted-foreground dark:text-[#b8b8b8]'>
											{friend.friend.displayName}
										</h1>
										{friend.status === 'PENDING' && (
											<span className='text-lg [@media(max-width:500px)]:text-sm text-muted-foreground dark:text-[#b8b8b8]'>
												запит надіслано
											</span>
										)}
									</div>
								</div>
							</Link>
						</CardHeader>
						<CardContent className='[@media(max-width:500px)]:px-1 flex flex-col justify-center items-center'>
							<FriendButton
								updateFriendList={updateFriendList}
								friendId={friend.friendId}
								status={friend.status}
							/>
						</CardContent>
					</Card>
				))}
			{localRequestFriendList &&
				!localFriendList &&
				localRequestFriendList.map((friend, i) => (
					<Card
						key={i}
						className='rounded-none border-none dark:bg-[#212121] flex flex-row justify-between gap-4 [@media(max-width:500px)]:gap-0'
					>
						<CardHeader className='[@media(max-width:500px)]:pl-2'>
							<Link
								href={
									process.env.NEXT_PUBLIC_DEFAULT_URL +
									'user/' +
									friend.user.displayName.slice(1)
								}
							>
								<div className='flex flex-nowrap relative flex-row items-center gap-3'>
									<Avatar className='w-24 h-24 [@media(max-width:500px)]:w-[68px] [@media(max-width:500px)]:h-[68px]'>
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
									{friend.user.active === 'ONLINE' ? (
										<span className='absolute top-[82px] left-[73px] [@media(max-width:500px)]:top-[58px] [@media(max-width:500px)]:left-[54px] border-white border-1 w-[12px] h-[12px] bg-green-500 rounded-full z-5' />
									) : null}
									<div className='flex flex-col space-y-1 break-all'>
										<div className='flex flex-row gap-2'>
											<h1 className='text-2xl dark:text-white [@media(max-width:500px)]:text-lg font-bold'>
												{friend.user.username}
											</h1>
											{friend.user.status === $Enums.UserStatus['VIP'] && (
												<Badge
													variant='secondary'
													className='flex items-center gap-1'
												>
													<Crown className='w-4 h-4' />
													<span className='[@media(max-width:900px)]:hidden'>
														VIP
													</span>
												</Badge>
											)}
										</div>
										<h1 className='text-lg [@media(max-width:500px)]:text-sm text-muted-foreground dark:text-[#b8b8b8]'>
											{friend.user.displayName}
										</h1>
									</div>
								</div>
							</Link>
						</CardHeader>
						<CardContent className='[@media(max-width:500px)]:px-1 flex flex-col justify-center items-center'>
							<FriendButton
								updateRequestFriendList={updateRequestFriendList}
								rejectFriendId={friend.userId}
								friendId={friend.friendId}
								status={friend.status}
							/>
						</CardContent>
					</Card>
				))}
		</>
	)
}
