'use server'
import { prisma } from '@/prisma/prisma-client'

export async function findFriendsByUsernameAndDisplayName(searchTerm: string) {
	try {
		const users = await prisma.user.findMany({
			where: {
				OR: [
					{ username: { contains: searchTerm, mode: 'insensitive' } },
					{ displayName: { contains: searchTerm, mode: 'insensitive' } },
				],
			},
			select: {
				id: true,
				username: true,
				displayName: true,
				avatarUrl: true,
			},
		})
		return users
	} catch (error) {
		throw new Error('Не удалось найти друзей.')
	}
}
