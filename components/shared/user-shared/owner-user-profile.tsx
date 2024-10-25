import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	TypeAuthUserByDisplayName,
	type TypeUserByDisplayName,
} from '@/types/user-types'
import { $Enums } from '@prisma/client'
import { Crown, Heart, Settings } from 'lucide-react'
import {
	AuthUserFriendButton,
	OwnerUserPanelContent,
	SkeletonImg,
} from '@/components/shared'
import { TypeSavedPosts } from '@/types/post.types'
import Link from 'next/link'

export const OwnerUserProfile: React.FC<{
	user: TypeUserByDisplayName | TypeAuthUserByDisplayName
	savedPosts: TypeSavedPosts
}> = ({ user, savedPosts }) => {
	return (
		<Card className='space-y-4 dark:bg-[#212121] dark:text-white dark:border-[#6f6f6f]'>
			<CardHeader className='space-y-6 dark:border-b-[1px] dark:border-[#6f6f6f] rounded-md border-b [@media(max-width:400px)]:p-3'>
				<div className='flex flex-nowrap flex-row items-center gap-3'>
					<Avatar
						className='w-24 h-24
					 [@media(min-width:500px)]:w-36 [@media(min-width:500px)]:h-36'
					>
						<AvatarImage
							src={
								user.avatarUrl
									? user.avatarUrl
									: process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
							}
							alt='User avatar'
						/>
						<AvatarFallback>
							<SkeletonImg />
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col space-y-1'>
						<div className='flex flex-row gap-2'>
							<h1 className='text-xl [@media(min-width:450px)]:text-2xl font-bold break-all'>
								{user.username}
							</h1>
							{user.status === $Enums.UserStatus['VIP'] && (
								<Badge
									variant='secondary'
									className='flex items-center h-[32px] w-[34px]'
								>
									<Crown className='w-4 h-4' />
								</Badge>
							)}
						</div>
						<h1 className='text-lg text-muted-foreground break-all'>
							{user.displayName}
						</h1>
						<div className='flex flex-row items-baseline gap-2 text-sm text-muted-foreground'>
							<AuthUserFriendButton
								displayName={user.displayName}
								friendCount={user.friendCount}
							/>
							<span className='flex items-center flex-nowrap w-fit gap-1'>
								<Heart className='w-4 h-4' />
								{user.totalReactions} likes
							</span>
						</div>
						<Link
							href={process.env.NEXT_PUBLIC_DEFAULT_URL + '/settings'}
							className='flex-2 text-sm md:text-md flex flex-row w-fit p-2 font-semibold rounded-2xl gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80'
						>
							<Settings className='w-6 h-6' /> Редагувати
						</Link>
					</div>
				</div>
				{user.bio ? <p className='text-sm'>{user.bio}</p> : null}
			</CardHeader>
			<CardContent className='space-y-6 min-h-[600px]'>
				<OwnerUserPanelContent savedPosts={savedPosts} posts={user.posts} />
			</CardContent>
		</Card>
	)
}
