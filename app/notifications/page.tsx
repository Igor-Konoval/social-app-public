import { auth } from '@/auth'
import { NotificationPage } from '@/components/shared'
import { getNotifications } from '@/services/notification.services'
import { TypeGetNotificationList } from '@/types/notification.types'
import {
	isToday,
	isWithinInterval,
	subDays,
	subMonths,
	subWeeks,
} from 'date-fns'
import { redirect } from 'next/navigation'

export default async function Page() {
	const session = await auth()
	if (session !== null) {
		const notifications = await (
			await getNotifications(+session.user.id)
		).reverse()

		const today: TypeGetNotificationList = []
		const lastThreeDays: TypeGetNotificationList = []
		const lastWeek: TypeGetNotificationList = []
		const lastMonth: TypeGetNotificationList = []

		notifications.forEach(notification => {
			const notificationDate = new Date(notification.createdAt)

			if (isToday(notificationDate)) {
				today.push(notification)
			} else if (
				isWithinInterval(notificationDate, {
					start: subDays(new Date(), 3),
					end: new Date(),
				})
			) {
				lastThreeDays.push(notification)
			} else if (
				isWithinInterval(notificationDate, {
					start: subWeeks(new Date(), 1),
					end: new Date(),
				})
			) {
				lastWeek.push(notification)
			} else if (
				isWithinInterval(notificationDate, {
					start: subMonths(new Date(), 1),
					end: new Date(),
				})
			) {
				lastMonth.push(notification)
			}
		})

		return (
			<NotificationPage
				today={today}
				lastThreeDays={lastThreeDays}
				lastWeek={lastWeek}
				lastMonth={lastMonth}
			/>
		)
	} else {
		return redirect(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
	}
}
