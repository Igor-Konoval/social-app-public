'use client'
import { useUnreadNotificationStore } from '@/stores/notification.store'
import { useEffect } from 'react'

export const NotificationClear: React.FC = () => {
	const clearUnreadNotifications = useUnreadNotificationStore(
		state => state.clearUnreadNotifications
	)

	useEffect(() => {
		clearUnreadNotifications()
	}, [])

	return <span className='hidden' />
}
