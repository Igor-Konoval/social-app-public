import { getNotifications } from '@/services/notification.services'

export type TypeGetNotificationList = Awaited<
	ReturnType<typeof getNotifications>
>
