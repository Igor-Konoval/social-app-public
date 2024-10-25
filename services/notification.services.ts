import { prisma } from '@/prisma/prisma-client'

export async function createNotification(
	receiverId: number,
	content: string,
	action: boolean = false,
	payloadData: string | null = null
) {
	try {
		await prisma.notification.create({
			data: {
				receiverId,
				content,
				action,
				payloadData,
			},
		})
	} catch (error) {
		console.error('Сталася помилка при відправці повідомлення')
	}
}

export async function getNotifications(userId: number) {
	try {
		await prisma.notification.updateMany({
			where: {
				receiverId: userId,
				status: 'UNREAD',
			},
			data: {
				status: 'READ',
			},
		})
		const notifications = await prisma.notification.findMany({
			where: {
				receiverId: userId,
			},
		})
		return notifications
	} catch (error) {
		console.error(error)
		throw new Error('Не вдалося отримати повідомлення')
	}
}

export async function getUnreadNotificationStatus(userId: number) {
	try {
		const data = await prisma.notification.findMany({
			where: {
				receiverId: userId,
				status: 'UNREAD',
			},
			select: {
				id: true,
			},
		})
		return data.length || 0
	} catch (error) {
		throw new Error('Failed to update message status')
	}
}
