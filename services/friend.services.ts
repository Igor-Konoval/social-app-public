import { $Enums } from '@prisma/client'
import { prisma } from '../prisma/prisma-client'
import { sendNotification } from '@/actions/notification.action'
import { createNotification } from './notification.services'

export async function sendFriendRequest(userId: number, friendId: number) {
	try {
		const existingFriendRequest = await prisma.friend.findUnique({
			where: {
				userId_friendId: {
					userId,
					friendId,
				},
			},
		})
		if (existingFriendRequest) {
			if (
				existingFriendRequest.status === 'PENDING' &&
				existingFriendRequest.userId === friendId
			) {
				await prisma.friend.update({
					where: {
						userId_friendId: {
							userId,
							friendId,
						},
					},
					data: {
						status: 'ACCEPTED',
					},
				})
				return {
					status: 'ACCEPTED',
					message: 'Ви додали друга.',
				}
			}

			await prisma.friend.delete({
				where: {
					userId_friendId: {
						userId,
						friendId,
					},
				},
			})
			return {
				status: 'REJECTED',
				message: 'Запит на дружбу скасовано.',
			}
		}

		const makeFriend = await prisma.friend.create({
			data: {
				userId,
				friendId,
				status: 'PENDING',
			},
			select: {
				status: true,
				userId: true,
			},
		})

		await createNotification(friendId, 'Ви отримали запит на дружбу.')

		await sendNotification(friendId, 'Ви отримали запит на дружбу.')
		return {
			status: 'PENDING',
			message: 'Запит на дружбу відправлено.',
			makeFriend,
		}
	} catch (error) {
		throw new Error('Не удалось создать запрос на дружбу.')
	}
}

export async function fetchSendFriendRequests(friendId: number): Promise<{
	status: 'PENDING' | 'REJECTED'
	message: string
	makeFriend?: {
		userId: number
		status: $Enums.FriendStatus
	}
}> {
	try {
		const data = await fetch('/api/friend/sender', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				friendId,
			}),
		})

		return data.json()
	} catch (error) {
		throw new Error('Не удалось отправить запрос на дружбу.')
	}
}

export async function acceptFriendRequest(friendId: number, userId: number) {
	// userId пользователь получивший запрос на дружбу и подтверждает её, friendId: идентификатор пользователя который сделал запрос на создание дружбы

	try {
		const friendship = await prisma.friend.findFirst({
			where: {
				userId,
				friendId,
			},
		})

		if (!friendship || friendship.status === 'ACCEPTED') {
			return undefined
		}

		const updatedFriendship = await prisma.friend.update({
			where: {
				userId_friendId: {
					userId,
					friendId,
				},
			},
			data: {
				status: 'ACCEPTED',
			},
			select: {
				status: true,
				userId: true,
			},
		})

		return [updatedFriendship]
	} catch (error) {
		throw new Error('Сталася помилка при підтвердженні дружби.')
	}
}

export async function fetchAcceptFriendRequest(friendId: number): Promise<
	| {
			userId: number
			status: $Enums.FriendStatus
	  }[]
	| undefined
> {
	try {
		const data = await fetch('/api/friend/receiver', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				friendId,
			}),
		})

		return data.json()
	} catch (error) {
		throw new Error('Не удалось подтвердить запрос на дружбу.')
	}
}

export async function acceptFriendRequest2(friendId: number, userId: number) {
	// userId пользователь получивший запрос на дружбу и подтверждает её, friendId: идентификатор пользователя который сделал запрос на создание дружбы

	try {
		const friendship = await prisma.friend.findFirst({
			where: {
				userId,
				friendId,
			},
		})

		if (!friendship || friendship.status === 'ACCEPTED') {
			return undefined
		}

		const updatedFriendship = await prisma.friend.update({
			where: {
				userId_friendId: {
					userId,
					friendId,
				},
			},
			data: {
				status: 'ACCEPTED',
			},
			include: {
				friend: {
					select: {
						avatarUrl: true,
						displayName: true,
						id: true,
						username: true,
						status: true,
					},
				},
			},
		})

		return updatedFriendship
	} catch (error) {
		throw new Error('Сталася помилка при підтвердженні дружби.')
	}
}

export async function fetchAcceptFriendRequest2(friendId: number): Promise<
	{
		friend: {
			id: number
			status: $Enums.UserStatus
			username: string
			displayName: string
			avatarUrl: string | null
		}
	} & {
		id: number
		friendId: number
		userId: number
		status: $Enums.FriendStatus
		createdAt: Date
	}
> {
	try {
		const data = await fetch('/api/friend/receiver2', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				friendId,
			}),
		})

		return data.json()
	} catch (error) {
		throw new Error('Не удалось подтвердить запрос на дружбу.')
	}
}

export async function rejectFriendRequest(friendId: number, userId: number) {
	// userId пользователь получивший запрос на дружбу и отменяет её, friendId: идентификатор пользователя который сделал запрос на создание дружбы

	try {
		const friendship = await prisma.friend.findFirst({
			where: {
				userId,
				friendId,
			},
		})
		if (!friendship) {
			return null
		}

		const updatedFriendship = await prisma.friend.delete({
			where: {
				userId_friendId: {
					userId,
					friendId,
				},
			},
		})
		return updatedFriendship
	} catch (error) {
		throw new Error('Сталася помилка при підтвердженні дружби.')
	}
}

export async function fetchRejectFriendRequest(friendId: number) {
	try {
		const data = await fetch('/api/friend/receiver', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				friendId,
			}),
		})
		return data.json()
	} catch (error) {
		throw new Error('Не удалось подтвердить запрос на дружбу.')
	}
}

export async function rejectFriendRequest2(friendId: number, userId: number) {
	try {
		const friendship = await prisma.friend.findFirst({
			where: {
				OR: [
					{
						userId,
						friendId,
					},
					{
						userId: friendId,
						friendId: userId,
					},
				],
			},
		})

		if (!friendship) {
			return null
		}

		const updatedFriendship = await prisma.friend.delete({
			where: {
				userId_friendId: {
					userId: friendship.userId,
					friendId: friendship.friendId,
				},
			},
		})

		return updatedFriendship
	} catch (error) {
		throw new Error('Сталася помилка при підтвердженні дружби')
	}
}

export async function fetchRejectFriendRequest2(friendId: number) {
	try {
		const data = await fetch('/api/friend/receiver2', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				friendId,
			}),
		})
		return data.json()
	} catch (error) {
		throw new Error('Не удалось подтвердить запрос на дружбу.')
	}
}

export async function getFriendList(userId: number) {
	try {
		const data = await prisma.friend.findMany({
			where: {
				userId,
			},
			include: {
				friend: {
					select: {
						avatarUrl: true,
						displayName: true,
						id: true,
						username: true,
						status: true,
						active: true,
					},
				},
			},
		})
		const data2 = await prisma.friend.findMany({
			where: {
				friendId: userId,
				status: 'ACCEPTED',
			},
			include: {
				user: {
					select: {
						avatarUrl: true,
						displayName: true,
						id: true,
						username: true,
						status: true,
						active: true,
					},
				},
			},
		})
		const updateData = data2.map(item => {
			return {
				id: item.id,
				friendId: item.userId,
				userId: item.friendId,
				status: item.status,
				createdAt: item.createdAt,
				friend: item.user,
			}
		})
		return data.concat(updateData)
	} catch (error) {
		throw new Error('Не удалось получить список друзей.')
	}
}

export async function getRequestFriendList(userId: number) {
	try {
		const data = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				friends: {
					where: {
						status: 'PENDING',
					},
					include: {
						user: {
							select: {
								avatarUrl: true,
								displayName: true,
								id: true,
								username: true,
								status: true,
								active: true,
							},
						},
					},
				},
			},
		})

		return data?.friends
	} catch (error) {
		throw new Error('Не удалось получить список друзей.')
	}
}

export async function getChatFriendList(userId: number) {
	try {
		const data = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				friends: {
					include: {
						user: {
							select: {
								id: true,
								avatarUrl: true,
								displayName: true,
								status: true,
								username: true,
							},
						},
					},
				},
				friendOf: {
					include: {
						friend: {
							select: {
								id: true,
								avatarUrl: true,
								displayName: true,
								status: true,
								username: true,
							},
						},
					},
				},
			},
		})

		return data
	} catch (error) {
		throw new Error('Не удалось получить список друзей.')
	}
}

export async function getUserFriendList(displayName: string) {
	try {
		const data = await prisma.user.findUnique({
			where: {
				displayName: '@' + displayName,
			},
			select: {
				username: true,
				displayName: true,
				avatarUrl: true,
				status: true,
				friendOf: {
					where: {
						status: 'ACCEPTED',
					},
					select: {
						friend: {
							select: {
								avatarUrl: true,
								displayName: true,
								id: true,
								username: true,
								status: true,
							},
						},
					},
				},
				friends: {
					where: {
						status: 'ACCEPTED',
					},
					select: {
						user: {
							select: {
								avatarUrl: true,
								displayName: true,
								id: true,
								username: true,
								status: true,
							},
						},
					},
				},
			},
		})

		return data
	} catch (error) {
		throw new Error('Не удалось получить список друзей.')
	}
}
