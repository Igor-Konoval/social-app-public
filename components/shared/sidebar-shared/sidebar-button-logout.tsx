'use client'
import { Button } from '../../ui/button'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { useEffect } from 'react'
import { fetchOnlineStatusUser } from '@/services/user.services'

export const SidebarButtonLogout: React.FC = () => {
	useEffect(() => {
		const setOnlineStatus = async () => await fetchOnlineStatusUser()
		setOnlineStatus()

		window.addEventListener('unload', function () {
			navigator.sendBeacon(
				process.env.NEXT_PUBLIC_DEFAULT_URL + 'api/auth/offline'
			)
		})
	}, [])

	return (
		<Button
			onClick={() => signOut()}
			variant='secondary'
			className='w-full rounded-t-none text-lg flex items-center gap-2'
		>
			<LogOut /> Log Out
		</Button>
	)
}
