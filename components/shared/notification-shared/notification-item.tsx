import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeDate } from '@/lib/utils'
import { TypeGetNotificationList } from '@/types/notification.types'
import { Bell, Info } from 'lucide-react'

export const NotificationItem: React.FC<{
	notification: TypeGetNotificationList[0]
}> = ({ notification }) => {
	return (
		<Card className='w-full dark:bg-[#212121] rounded-none dark:border-[#b8b8b8] border-r-0 border-l-0'>
			<CardHeader className='pb-3 pt-3'>
				<CardTitle className='flex flex-row justify-between gap-2 text-lg'>
					<span className='flex flex-row dark:text-white items-center gap-2'>
						Нове повідомлення <Bell className='w-5 h-5' />
					</span>
					<span className='flex flex-row items-center text-sm text-muted-foreground font-semibold dark:text-[#b8b8b8]'>
						Отримано {formatRelativeDate(notification.createdAt)}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className='pb-4 flex dark:text-white flex-row gap-2'>
				<Info className='w-6 h-6' /> {notification.content}
			</CardContent>
		</Card>
	)
}
