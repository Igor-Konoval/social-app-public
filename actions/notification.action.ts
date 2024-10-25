'use server'
import { pusherServer } from '@/lib/pusher'

export async function sendNotification(userId: number, message: string) {
	try {
		await pusherServer.trigger('notifications-' + userId, 'push-notification', {
			message,
		})
	} catch (error: any) {
		throw new Error('Сталася помилка при відправці повідомлення.')
	}
}
