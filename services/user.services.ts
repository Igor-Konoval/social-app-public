import { prisma } from '@/prisma/prisma-client'
import { TypeUserSettings } from '@/types/user-types'
export function getUsers() {
	try {
		const data = prisma.user.findMany({
			select: {
				displayName: true,
			},
		})
		return data
	} catch (error) {
		throw new Error('Failed to get users')
	}
}

export async function getUserByDisplayName(displayName: string) {
	try {
		const data = await prisma.user.findUnique({
			where: {
				displayName: '@' + displayName,
			},
			include: {
				posts: {
					orderBy: {
						createdAt: 'desc',
					},
					select: {
						id: true,
						imageUrl: true,
						content: true,
						// Получаем количество реакций на каждом посте
						_count: {
							select: {
								reactions: true,
							},
						},
					},
				},
				// Получаем количество друзей
				friends: {
					select: {
						status: true,
					},
				},
				_count: {
					select: {
						friendOf: {
							where: {
								status: 'ACCEPTED',
							},
						},
					},
				},
			},
		})

		if (!data) {
			return false
		}

		const totalReactions =
			data?.posts.reduce((sum, post) => sum + post._count.reactions, 0) || 0

		const friendCount =
			data?.friends.filter(friend => friend.status === 'ACCEPTED').length +
				data._count.friendOf || 0

		if (data?.friends) {
			delete (data as { friends?: unknown })['friends']
		}
		if (data?.password) {
			delete (data as { password?: unknown })['password']
		}
		if (data?.providerId) {
			delete (data as { providerId?: unknown })['providerId']
		}
		return {
			...data,
			totalReactions: totalReactions || 0,
			friendCount: friendCount || 0,
		}
	} catch (error) {
		throw new Error('Failed to get user by display name')
	}
}

export async function getAuthUserByDisplayName(
	displayName: string,
	currentUserId: number
) {
	try {
		const data = await prisma.user.findUnique({
			where: {
				displayName: '@' + displayName,
			},
			include: {
				posts: {
					select: {
						id: true,
						imageUrl: true,
						content: true,
						// Получаем количество реакций на каждом посте
						_count: {
							select: {
								reactions: true,
							},
						},
					},
					orderBy: {
						createdAt: 'desc',
					},
				},
				// Получаем количество друзей
				friends: {
					select: {
						status: true,
						userId: true,
					},
				},
				// Проверка на дружбу с текущим пользователем
				friendOf: {
					where: {
						friendId: currentUserId, // проверяем, есть ли друг текущего пользователя
					},
					select: {
						status: true,
						userId: true,
					},
				},
				_count: {
					select: {
						friendOf: {
							where: {
								status: 'ACCEPTED',
							},
						},
					},
				},
			},
		})

		if (!data) {
			return false
		}

		const totalReactions =
			data?.posts.reduce((sum, post) => sum + post._count.reactions, 0) || 0

		const friendCount =
			data?.friends.filter(friend => friend.status === 'ACCEPTED').length +
				data._count.friendOf || 0

		if (data?.password) {
			delete (data as { password?: unknown })['password']
		}
		if (data?.providerId) {
			delete (data as { providerId?: unknown })['providerId']
		}

		const makeFriend = data?.friends.find(
			friend => friend.userId === currentUserId
		)

		if (data?.friends) {
			delete (data as { friends?: unknown })['friends']
		}
		return {
			...data,
			makeFriend,
			totalReactions,
			friendCount,
		}
	} catch (error) {
		throw new Error('Failed to get user by display name')
	}
}

export async function getUserSettingsByUserId(userId: number) {
	try {
		const data = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				email: true,
				displayName: true,
				avatarUrl: true,
				password: true,
				username: true,
				bio: true,
			},
		})

		if (!data) {
			return null
		}

		return {
			...data,
			password: data.password ? true : false,
		}
	} catch (error) {
		throw new Error('Failed to get user settings')
	}
}

export async function updateUserSettings(
	userId: number,
	updateArgs: TypeUserSettings
) {
	try {
		const data = await prisma.user.update({
			where: {
				id: userId,
			},
			data: updateArgs,
		})
		if (data) {
			return true
		} else {
			return false
		}
	} catch (error) {
		throw new Error('Failed to update user settings')
	}
}
export function fetchUpdateUserSettings(updateArgs: FormData) {
	try {
		const data = fetch('/api/auth/update', {
			method: 'POST',
			body: updateArgs,
		}).then(res => res.json())
		return data
	} catch (error: any) {
		throw new Error('Failed to get users')
	}
}

export async function getPopularUsers() {
	try {
		const sortByOptions = [
			{ posts: { _count: 'asc' as const } },
			{ reactions: { _count: 'desc' as const } },
			{ comments: { _count: 'desc' as const } },
			{ friends: { _count: 'desc' as const } },
		]

		const randomSortOption =
			sortByOptions[Math.floor(Math.random() * sortByOptions.length)]

		const popularUsers = await prisma.user.findMany({
			take: 5,
			orderBy: randomSortOption,
			select: {
				avatarUrl: true,
				username: true,
				displayName: true,
				id: true,
				status: true,
			},
		})

		return popularUsers
	} catch (error) {
		throw new Error('Failed to get popular users')
	}
}

export async function changeToOnlineStatusUser(userId: number) {
	try {
		const data = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				active: 'ONLINE',
			},
		})
		if (data) {
			return true
		} else {
			return false
		}
	} catch (error) {
		throw new Error('Failed to change user status')
	}
}

export async function fetchOnlineStatusUser(): Promise<boolean> {
	try {
		const data = await fetch(
			process.env.NEXT_PUBLIC_DEFAULT_URL + 'api/auth/online'
		)
		return data.json()
	} catch (error) {
		throw new Error('Failed to fetch online status user')
	}
}

export async function changeToOfflineStatusUser(userId: number) {
	try {
		const data = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				active: 'OFFLINE',
			},
		})
		if (data) {
			return true
		} else {
			return false
		}
	} catch (error) {
		throw new Error('Failed to change user status')
	}
}
