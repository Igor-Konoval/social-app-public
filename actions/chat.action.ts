'use server'
import { base64ToFile, uploadImages } from '@/lib/cloudinary'
import { pusherServer } from '@/lib/pusher'
import { createMessage, sendImgMessage } from '@/services/message.services'

export async function sendMessage(
	userId: number,
	conversationId: number,
	content: string
) {
	try {
		const message = await createMessage(userId, conversationId, content)

		await pusherServer.trigger(
			'conversation-' + conversationId,
			'send-message',
			{
				message,
			}
		)
	} catch (error: any) {
		throw new Error('Не удалось отправить уведомление.')
	}
}

export async function sendImageMessage(
	userId: number,
	conversationId: number,
	imageBase64: string
) {
	try {
		const mimeType = imageBase64.match(/data:(.*);base64,/)?.[1] || 'image/png'
		const image = base64ToFile(imageBase64, 'uploaded_image.png', mimeType)

		const uploadPromises = await uploadImages([image], 1)
		const uploadImg = await Promise.all(uploadPromises)
		const message = await sendImgMessage(
			userId,
			conversationId,
			'image',
			uploadImg[0]
		)
		await pusherServer.trigger(
			'conversation-' + conversationId,
			'send-message',
			{
				message,
			}
		)
		return true
	} catch (error: any) {
		throw new Error('Не удалось отправить уведомление.')
	}
}

export async function pushNoticeMessage(
	userName: string,
	receiverUserId: number,
	conversationId: number
) {
	try {
		await pusherServer.trigger(
			'conversation-' + receiverUserId,
			'push-message',
			{
				conversationId,
				content: 'Ви отримали нове повідомлення від' + ' ' + userName,
			}
		)
	} catch (error: any) {
		throw new Error('Не удалось отправить уведомление.')
	}
}

export async function pushUserActiveStatus(
	userId: number,
	receiverUserId: number
) {
	try {
		await pusherServer.trigger(
			'conversation-' + receiverUserId,
			'push-user-active-status',
			{
				payload: {
					userId,
				},
			}
		)
	} catch (error: any) {
		throw new Error('Не удалось отправить статус.')
	}
}

export async function pushUserNotActiveStatus(
	userId: number,
	receiverUserId: number
) {
	try {
		await pusherServer.trigger(
			'conversation-' + receiverUserId,
			'push-user-not-active-status',
			{
				payload: {
					userId,
				},
			}
		)
	} catch (error: any) {
		throw new Error('Не удалось отправить статус.')
	}
}

export async function pushUserPrint(
	username: string,
	userId: number,
	receiverUserId: number
) {
	try {
		await pusherServer.trigger(
			'conversation-' + receiverUserId,
			'push-user-print',
			{
				payload: {
					username,
					userId,
				},
			}
		)
	} catch (error: any) {
		throw new Error('Не удалось отправить статус.')
	}
}

export async function pushUserNotPrint(
	username: string,
	userId: number,
	receiverUserId: number
) {
	try {
		await pusherServer.trigger(
			'conversation-' + receiverUserId,
			'push-user-not-print',
			{
				payload: {
					username,
					userId,
				},
			}
		)
	} catch (error: any) {
		throw new Error('Не удалось отправить статус.')
	}
}
