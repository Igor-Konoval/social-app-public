'use client'
import { LogOut, Contact, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Button } from '../../ui/button'
import { signOut } from 'next-auth/react'
import {
	SidebarNotificationButton,
	SidebarMessagesButton,
	SkeletonImg,
} from '@/components/shared'
import { useUnreadMessagesStore } from '@/stores/messages.store'
import { useUnreadNotificationStore } from '@/stores/notification.store'

export const MobileMenu: React.FC<{
	isOpen: boolean
	closeMenu: () => void
	user: {
		id: string
		username: string
		displayName: string
		token: string
		avatarUrl: string | null | undefined
	}
}> = ({ isOpen, user, closeMenu }) => {
	const unreadMessages = useUnreadMessagesStore(state => state.unreadMessages)
	const unreadNotifications = useUnreadNotificationStore(
		state => state.unreadNotifications
	)
	return (
		<div
			className='text-lg absolute z-[99999] right-0 bottom-[53px] bg-white dark:bg-[#212121] border border-black-200 rounded-lg flex flex-col h-fit '
			style={{ visibility: isOpen ? 'visible' : 'hidden' }}
		>
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
					<h2>{user.username}</h2>
					<h2 className=' text-sm text-gray-400'>{user.displayName}</h2>
				</div>
			</div>
			<nav onPointerDown={closeMenu} className='space-y-3 w-full'>
				<ul>
					<li className='custom-row'>
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
					<li className='custom-row'>
						<Link
							href={process.env.NEXT_PUBLIC_DEFAULT_URL + 'friends'}
							className='flex items-center gap-2'
						>
							<Contact /> {'Friends'}
						</Link>
					</li>
					<li className='custom-row'>
						<SidebarMessagesButton
							countMessagesUnread={unreadMessages}
							isMobile={true}
							userId={user.id}
						/>
					</li>
					<li className='custom-row'>
						<SidebarNotificationButton
							countNotificationsUnread={unreadNotifications}
							isMobile={true}
							userId={user.id}
						/>
					</li>
				</ul>
			</nav>
			<hr />
			<div onPointerDown={closeMenu} className='custom-row'>
				<Link
					href={process.env.NEXT_PUBLIC_DEFAULT_URL + 'settings'}
					className='flex items-center gap-2'
				>
					<Settings /> Settings
				</Link>
			</div>
			<div>
				<Button
					onClick={() => signOut()}
					variant='secondary'
					className='w-full text-lg flex items-start gap-2'
				>
					<LogOut /> Log Out
				</Button>
			</div>
		</div>
	)
}
