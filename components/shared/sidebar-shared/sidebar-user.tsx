import { Contact, Home, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import {
	SidebarNotificationButton,
	SidebarMessagesButton,
	SkeletonImg,
	SidebarButtonLogout,
} from '@/components/shared'
import { getMessagesStatus } from '@/services/message.services'
import { getUnreadNotificationStatus } from '@/services/notification.services'

export const Sidebar: React.FC<{
	user: {
		id: string
		username: string
		displayName: string
		avatarUrl: string | null | undefined
	}
}> = async ({ user }) => {
	const countMessagesUnread = await getMessagesStatus(+user.id)
	const countNotificationsUnread = await getUnreadNotificationStatus(+user.id)
	return (
		<div className='text-lg border border-black-200 rounded-lg flex flex-col h-fit '>
			<div className='flex items-center px-3 pt-2 gap-2 font-semibold'>
				<Avatar>
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
				<div className='flex flex-col'>
					<h2>
						{user.username.length > 13
							? user.username.slice(0, 13) + '...'
							: user.username}
					</h2>
					<h2 className=' text-sm text-gray-400'>
						{user.displayName.length > 13
							? user.displayName.slice(0, 13) + '...'
							: user.displayName}
					</h2>
				</div>
			</div>
			<nav className='space-y-3 w-full'>
				<ul>
					<li className='custom-row rounded-none'>
						<Link
							href={process.env.NEXT_PUBLIC_DEFAULT_URL as string}
							className='flex items-center gap-2'
						>
							<Home /> {'Main page'}
						</Link>
					</li>
					<li className='custom-row rounded-none'>
						<Link
							href={
								process.env.NEXT_PUBLIC_DEFAULT_URL +
								'user/' +
								user.displayName.slice(1)
							}
							className='flex items-center gap-2'
						>
							<User /> {'Profile'}
						</Link>
					</li>
					<li className='custom-row rounded-none'>
						<Link
							href={process.env.NEXT_PUBLIC_DEFAULT_URL + 'friends'}
							className='flex items-center gap-2'
						>
							<Contact /> {'Friends'}
						</Link>
					</li>
					<li className='custom-row rounded-none'>
						<SidebarMessagesButton
							countMessagesUnread={countMessagesUnread}
							userId={user.id}
						/>
					</li>
					<li className='custom-row rounded-none'>
						<SidebarNotificationButton
							countNotificationsUnread={countNotificationsUnread}
							userId={user.id}
						/>
					</li>
				</ul>
			</nav>
			<hr />
			<div className='custom-row rounded-none'>
				<Link
					href={process.env.NEXT_PUBLIC_DEFAULT_URL + 'settings'}
					className='flex items-center gap-2'
				>
					<Settings /> Settings
				</Link>
			</div>
			<div>
				<SidebarButtonLogout />
			</div>
		</div>
	)
}
