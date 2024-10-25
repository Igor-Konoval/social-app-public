import { TypeGetNotificationList } from '@/types/notification.types'
import { NotificationItem } from './notification-item'
import { Title } from '@/components/ui/title'
import { ArrowDown } from 'lucide-react'
import { NotificationClear } from './notification-clear'
import Link from 'next/link'

export const NotificationPage: React.FC<{
	today: TypeGetNotificationList
	lastThreeDays: TypeGetNotificationList
	lastWeek: TypeGetNotificationList
	lastMonth: TypeGetNotificationList
}> = ({ lastMonth, lastWeek, lastThreeDays, today }) => {
	return (
		<div className='space-y-3 min-h-screen border dark:border-[#6f6f6f]'>
			<span className='flex flex-row items-center gap-1'>
				<Title
					className='font-semibold text-muted-foreground ml-6 mt-4'
					size='lg'
					text='Сторінка повідомлень:'
				/>
			</span>
			{!!today.length && (
				<>
					<span className='flex flex-row items-center gap-1'>
						<Title
							className='font-semibold ml-6 mt-0'
							size='md'
							text='Сьогодні'
						/>{' '}
						<ArrowDown className='w-6 h-6' />
					</span>
					<div className='space-y-3 mt-1'>
						{today.map(notification =>
							notification.action && notification.payloadData !== null ? (
								<Link
									href={
										process.env.NEXT_PUBLIC_DEFAULT_URL +
										'post/' +
										notification.payloadData
									}
								>
									<NotificationItem
										key={notification.id}
										notification={notification}
									/>
								</Link>
							) : (
								<NotificationItem
									key={notification.id}
									notification={notification}
								/>
							)
						)}
					</div>
				</>
			)}
			{!!lastThreeDays.length && (
				<>
					<span className='flex flex-row items-center gap-1'>
						<Title
							className='font-semibold ml-6 mt-0'
							size='md'
							text='За останні три дні'
						/>{' '}
						<ArrowDown className='w-6 h-6' />
					</span>
					<div className='space-y-3'>
						{lastThreeDays.map(notification =>
							notification.action && notification.payloadData !== null ? (
								<Link
									href={
										process.env.NEXT_PUBLIC_DEFAULT_URL +
										'post/' +
										notification.payloadData
									}
								>
									<NotificationItem
										key={notification.id}
										notification={notification}
									/>
								</Link>
							) : (
								<NotificationItem
									key={notification.id}
									notification={notification}
								/>
							)
						)}
					</div>
				</>
			)}
			{!!lastWeek.length && (
				<>
					<span className='flex flex-row items-center gap-1'>
						<Title
							className='font-semibold ml-6 mt-0'
							size='md'
							text='За останній тиждень'
						/>{' '}
						<ArrowDown className='w-6 h-6' />
					</span>
					<div className='space-y-3'>
						{lastWeek.map(notification =>
							notification.action && notification.payloadData !== null ? (
								<Link
									href={
										process.env.NEXT_PUBLIC_DEFAULT_URL +
										'post/' +
										notification.payloadData
									}
								>
									<NotificationItem
										key={notification.id}
										notification={notification}
									/>
								</Link>
							) : (
								<NotificationItem
									key={notification.id}
									notification={notification}
								/>
							)
						)}
					</div>
				</>
			)}
			{!!lastMonth.length && (
				<>
					<span className='flex flex-row items-center gap-1'>
						<Title
							className='font-semibold ml-6 mt-0'
							size='md'
							text='За останній місяць'
						/>{' '}
						<ArrowDown className='w-6 h-6' />
					</span>
					<div className='space-y-3'>
						{lastMonth.map(notification =>
							notification.action && notification.payloadData !== null ? (
								<Link
									href={
										process.env.NEXT_PUBLIC_DEFAULT_URL +
										'post/' +
										notification.payloadData
									}
								>
									<NotificationItem
										key={notification.id}
										notification={notification}
									/>
								</Link>
							) : (
								<NotificationItem
									key={notification.id}
									notification={notification}
								/>
							)
						)}
					</div>
				</>
			)}
			<NotificationClear />
		</div>
	)
}
