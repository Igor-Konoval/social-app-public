import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import { TypeGetUserFriendList } from '@/types/friend.types'
import { $Enums } from '@prisma/client'
import { Crown, Users2 } from 'lucide-react'
import Link from 'next/link'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const FriendsUserPage: React.FC<{ userData: TypeGetUserFriendList }> = ({
	userData,
}) => {
	if (userData === null) {
		return (
			<div className='flex items-center justify-center min-h-[70vh]'>
				<p className='text-2xl dark:text-white font-semibold text-muted-foreground'>
					No friends yet
				</p>
			</div>
		)
	}

	return (
		<div className='min-h-screen border dark:border-[#575757]'>
			<Card className='mb-6 dark:bg-[#212121] border-x-0 rounded-t-none dark:border-[#575757]'>
				<CardHeader>
					<div className='flex items-center space-x-4'>
						<Avatar className='w-24 h-24'>
							<AvatarImage
								src={
									userData.avatarUrl ||
									process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
								}
								alt={`${userData.username}'s avatar`}
							/>
							<AvatarFallback>
								{userData.username.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className='text-3xl font-bold flex items-center dark:text-white gap-2'>
								{userData.username}
								{userData.status === $Enums.UserStatus['VIP'] && (
									<Badge
										variant='secondary'
										className='flex items-center gap-1'
									>
										<Crown className='w-4 h-4' />
										VIP
									</Badge>
								)}
							</h1>
							<p className='text-xl text-muted-foreground dark:text-gray-400'>
								{userData.displayName}
							</p>
						</div>
					</div>
				</CardHeader>
			</Card>
			<div className='flex items-center justify-evenly mb-3'>
				<h2 className='space-y-1'>
					<span className='text-2xl font-bold flex items-center gap-2'>
						<Users2 className='w-6 h-6' />
						Список друзів
					</span>
					<div className='w-full h-[2px] bg-black dark:bg-white' />
				</h2>
				<Badge variant='outline'>
					{userData.friends.length + userData.friendOf.length} friends
				</Badge>
			</div>
			{userData.friends.map((friend, i) => (
				<Card
					key={i}
					className='rounded-none dark:bg-[#212121] border-none flex flex-row justify-between gap-4'
				>
					<Link
						href={
							process.env.NEXT_PUBLIC_DEFAULT_URL +
							'/user/' +
							friend.user.displayName.slice(1)
						}
					>
						<CardHeader>
							<div className='flex flex-nowrap flex-row items-center gap-3'>
								<Avatar className='w-20 h-20'>
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
								<div className='flex flex-col space-y-1'>
									<div className='flex flex-row gap-2'>
										<h1 className='text-2xl dark:text-white font-bold flex flex-row items-center gap-2'>
											{friend.user.username}
										</h1>

										{friend.user.status === $Enums.UserStatus['VIP'] && (
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												<Crown className='w-4 h-4' />
												VIP
											</Badge>
										)}
									</div>
									<h1 className='text-lg text-muted-foreground dark:text-gray-400'>
										{friend.user.displayName}
									</h1>
								</div>
							</div>
						</CardHeader>
					</Link>
				</Card>
			))}
			{userData.friendOf.map((friend, i) => (
				<Card
					key={i}
					className='rounded-none dark:bg-[#212121] border-none flex flex-row justify-between gap-4'
				>
					<Link
						href={
							process.env.NEXT_PUBLIC_DEFAULT_URL +
							'/user/' +
							friend.friend.displayName.slice(1)
						}
					>
						<CardHeader>
							<div className='flex flex-nowrap flex-row items-center gap-3'>
								<Avatar className='w-20 h-20'>
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
								<div className='flex flex-col space-y-1'>
									<div className='flex flex-row gap-2'>
										<h1 className='text-2xl font-bold dark:text-white flex flex-row items-center gap-2'>
											{friend.friend.username}
										</h1>

										{friend.friend.status === $Enums.UserStatus['VIP'] && (
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												<Crown className='w-4 h-4' />
												VIP
											</Badge>
										)}
									</div>
									<h1 className='text-lg text-muted-foreground dark:text-gray-400'>
										{friend.friend.displayName}
									</h1>
								</div>
							</div>
						</CardHeader>
					</Link>
				</Card>
			))}
		</div>
	)
}
