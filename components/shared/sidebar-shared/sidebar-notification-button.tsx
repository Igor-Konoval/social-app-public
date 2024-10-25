'use client'

import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { pusherClient } from '@/lib/pusher'
import { useUnreadNotificationStore } from '@/stores/notification.store'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export const SidebarNotificationButton: React.FC<{
	countNotificationsUnread: number
	isMobile?: boolean
	userId: string
}> = ({ countNotificationsUnread, isMobile, userId }) => {
	// const [countNotifications, setCountNotifications] = useState(0)
	const unreadNotifications = useUnreadNotificationStore(
		state => state.unreadNotifications
	)
	const incrementUnreadNotifications = useUnreadNotificationStore(
		state => state.incrementUnreadNotifications
	)
	const setUnreadNotifications = useUnreadNotificationStore(
		state => state.setUnreadNotifications
	)

	useEffect(() => {
		if (isMobile) return
		if (countNotificationsUnread === undefined) return
		setUnreadNotifications(countNotificationsUnread)
	}, [])

	useEffect(() => {
		if (isMobile) return
		const channelName = 'notifications-' + userId
		const channel = pusherClient.subscribe(channelName)

		const handleNotification = (data: any) => {
			incrementUnreadNotifications()
			toast({
				title: 'У вас нове повідомлення',
				duration: 3500,
				description: data.message || 'Перевірте сторінку повідомлень',
			})
		}

		channel.bind('push-notification', handleNotification)

		return () => {
			channel.unbind('push-notification', handleNotification)
			pusherClient.unsubscribe(channelName)
		}
	}, [])
	return (
		<Link
			href={process.env.NEXT_PUBLIC_DEFAULT_URL + 'notifications'}
			className='flex items-center gap-2'
			// onClick={() => setCountNotifications(0)}
		>
			<Bell /> {'Notifications'}{' '}
			{!!unreadNotifications && (
				<Badge variant='secondary'>{unreadNotifications}</Badge>
			)}
		</Link>
	)
}
