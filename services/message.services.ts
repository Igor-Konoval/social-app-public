import { prisma } from '@/prisma/prisma-client'
import { TypeGetAllChatsForShare } from '@/types/chat-types'

export async function getAllChats(userId: number) {
	try {
		const data = await prisma.conversation.findMany({
			where: {
				users: {
					some: {
						userId: userId,
					},
				},
			},
			select: {
				variant: true,
				id: true,
				users: {
					select: {
						messageStatus: true,
						user: {
							select: {
								username: true,
								avatarUrl: true,
								id: true,
								active: true,
							},
						},
					},
				},
				messages: {
					orderBy: {
						createdAt: 'desc',
					},
					take: 1,
					select: {
						id: true,
						content: true,
						messageVariant: true,
						createdAt: true,
						user: {
							select: {
								id: true,
								username: true,
							},
						},
					},
				},
			},
		})
		data.sort((a, b) => {
			const aLastMessageDate = a.messages[0]?.createdAt || 0
			const bLastMessageDate = b.messages[0]?.createdAt || 0
			return (
				new Date(bLastMessageDate).getTime() -
				new Date(aLastMessageDate).getTime()
			)
		})
		return data
	} catch (error) {
		throw new Error('Failed to get all user chats')
	}
}

export async function getAllChatsForShare(userId: number) {
	try {
		const conversations = await prisma.conversation.findMany({
			where: {
				users: {
					some: {
						userId: userId,
					},
				},
			},
			select: {
				id: true,
				variant: true,
				users: {
					select: {
						user: {
							select: {
								username: true,
								displayName: true,
								avatarUrl: true,
								id: true,
							},
						},
					},
					take: 4,
				},
			},
		})

		const excludeIds = conversations
			.filter(conversation => conversation.variant === 'ONETOONE')
			.map(item =>
				item.users
					.filter(user => user.user.id !== userId)
					.map(user => user.user.id)
			)
			.flat()

		const friends = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				friends: {
					where: {
						userId: {
							notIn: excludeIds,
						},
					},
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
					where: {
						friendId: {
							notIn: excludeIds,
						},
					},
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

		if (friends) {
			friends.friends.map(item => ({
				...item,
				userId: item.friendId,
				friendId: item.userId,
			}))
		}
		const update = conversations.map(conversation => ({
			...conversation,
			users: conversation.users.filter(user => user.user.id !== userId),
		}))
		return { conversations: update, friends }
	} catch (error) {
		throw new Error('Failed to get all user chats')
	}
}

export async function fetchShareData(): Promise<TypeGetAllChatsForShare> {
	const response = await fetch(
		process.env.NEXT_PUBLIC_DEFAULT_URL + '/api/posts/share'
	)
	if (!response.ok) {
		throw new Error('Failed to fetch share data')
	}
	return response.json()
}

export async function oneToOneConversation(userId: number, friendId: number) {
	try {
		let conversation = await prisma.conversation.findFirst({
			where: {
				AND: [
					{
						users: {
							some: {
								userId: userId,
							},
						},
					},
					{
						users: {
							some: {
								userId: friendId,
							},
						},
					},
					{
						variant: 'ONETOONE',
					},
				],
			},
		})

		if (!conversation) {
			conversation = await prisma.conversation.create({
				data: {
					users: {
						create: [{ userId }, { userId: friendId }],
					},
				},
			})
		}

		return conversation
	} catch (error) {
		throw new Error('Failed to get or create a conversation')
	}
}

export async function checkOneToOneConversation(
	userId: number,
	idConversation: number,
	skip: number
) {
	try {
		const data = await prisma.conversation.findFirst({
			where: {
				id: idConversation,
				users: {
					some: {
						userId: userId,
					},
				},
			},
			include: {
				messages: {
					take: 30,
					skip,
					orderBy: {
						createdAt: 'desc',
					},

					select: {
						user: {
							select: {
								id: true,
								username: true,
								avatarUrl: true,
								displayName: true,
							},
						},
						content: true,
						createdAt: true,
						messageVariant: true,
						imageUrl: true,
						postUsername: true,
						postId: true,
						postUserAvatarUrl: true,
						id: true,
					},
				},
				users: {
					include: {
						user: {
							select: {
								id: true,
								username: true,
								avatarUrl: true,
								displayName: true,
								status: true,
								active: true,
							},
						},
					},
				},
			},
		})
		data?.messages.reverse()
		return data
	} catch (error) {
		throw new Error('Failed to get or create a conversation')
	}
}

export async function oneToOneConversationMessages(
	userId: number,
	idConversation: number,
	skip: number
) {
	try {
		const data = await prisma.conversation.findFirst({
			where: {
				id: idConversation,
				users: {
					some: {
						userId: userId,
					},
				},
			},
			include: {
				messages: {
					take: 30,
					skip,
					orderBy: {
						createdAt: 'desc',
					},

					select: {
						user: {
							select: {
								id: true,
								username: true,
								avatarUrl: true,
								displayName: true,
							},
						},
						content: true,
						createdAt: true,
						messageVariant: true,
						imageUrl: true,
						postUsername: true,
						postId: true,
						postUserAvatarUrl: true,
						id: true,
					},
				},
			},
		})
		return data?.messages
	} catch (error) {
		throw new Error('Failed to get or create a conversation')
	}
}

export async function fetchOneToOneConversationMessages(
	conversationId: number,
	skip: number
) {
	try {
		const data = await fetch(
			process.env.NEXT_PUBLIC_DEFAULT_URL +
				`/api/chats/t?skip=${skip}&conversationId=${conversationId}`
		)
		return data.json()
	} catch (error) {
		throw new Error('Failed to get conversation data')
	}
}

export async function fetchOneToOneConversation(
	friendId: number
): Promise<{ id: string }> {
	try {
		const result = await fetch(
			process.env.NEXT_PUBLIC_DEFAULT_URL + '/api/chats/t',
			{
				method: 'POST',
				body: JSON.stringify({
					friendId: friendId,
				}),
			}
		)
		return result.json()
	} catch (error) {
		throw new Error('Failed to fetch get or create a conversation')
	}
}

export async function createMessage(
	userId: number,
	conversationId: number,
	content: string
) {
	try {
		const data = await prisma.message.create({
			data: {
				content,
				conversationId,
				userId,
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						avatarUrl: true,
					},
				},
			},
		})

		await prisma.conversationUser.updateMany({
			where: {
				conversationId,
				userId: { not: userId },
			},
			data: {
				messageStatus: 'UNREAD',
			},
		})

		return data
	} catch (error) {
		throw new Error('Failed to create message')
	}
}

export async function sendImgMessage(
	userId: number,
	conversationId: number,
	content: string,
	imageUrl: string
) {
	try {
		const data = await prisma.message.create({
			data: {
				content,
				conversationId,
				userId,
				messageVariant: 'IMAGE',
				imageUrl,
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						avatarUrl: true,
					},
				},
			},
		})

		await prisma.conversationUser.updateMany({
			where: {
				conversationId,
				userId: { not: userId },
			},
			data: {
				messageStatus: 'UNREAD',
			},
		})

		return data
	} catch (error) {
		throw new Error('Failed to create message')
	}
}

export async function conversation(userId: number, friendsId: number[]) {
	const friendsArg = friendsId.map(id => ({ users: { some: { userId: id } } }))
	try {
		let conversation = await prisma.conversation.findFirst({
			where: {
				AND: [
					{
						users: {
							some: {
								userId: userId,
							},
						},
					},
					{
						variant: 'CONVERSATION',
					},
					...friendsArg,
				],
			},
		})

		if (!conversation) {
			const friendsArg2 = friendsId.map(id => ({ userId: id }))
			conversation = await prisma.conversation.create({
				data: {
					users: {
						create: [{ userId }, ...friendsArg2],
					},
					variant: 'CONVERSATION',
				},
			})
		}

		return conversation
	} catch (error) {
		throw new Error('Failed to get or create a conversation')
	}
}

export async function checkConversation(
	userId: number,
	idConversation: number,
	skip: number
) {
	try {
		const data = await prisma.conversation.findFirst({
			where: {
				id: idConversation,
				users: {
					some: {
						userId: userId,
					},
				},
			},
			include: {
				messages: {
					take: 30,
					skip,
					orderBy: {
						createdAt: 'desc',
					},
					select: {
						user: {
							select: {
								id: true,
								username: true,
								avatarUrl: true,
							},
						},
						content: true,
						messageVariant: true,
						imageUrl: true,
						postUsername: true,
						postId: true,
						postUserAvatarUrl: true,
						createdAt: true,
						id: true,
					},
				},
				users: {
					include: {
						user: {
							select: {
								id: true,
								username: true,
							},
						},
					},
				},
			},
		})

		data?.messages.reverse()
		return data
	} catch (error) {
		throw new Error('Failed to get or create a conversation')
	}
}

export async function conversationMessages(
	userId: number,
	idConversation: number,
	skip: number
) {
	try {
		const data = await prisma.conversation.findFirst({
			where: {
				id: idConversation,
				users: {
					some: {
						userId: userId,
					},
				},
			},
			include: {
				messages: {
					take: 30,
					skip,
					orderBy: {
						createdAt: 'desc',
					},

					select: {
						user: {
							select: {
								id: true,
								username: true,
								avatarUrl: true,
							},
						},
						content: true,
						createdAt: true,
						messageVariant: true,
						imageUrl: true,
						postUsername: true,
						postId: true,
						postUserAvatarUrl: true,
						id: true,
					},
				},
			},
		})
		return data?.messages
	} catch (error) {
		throw new Error('Failed to get or create a conversation')
	}
}

export async function fetchConversationMessages(
	conversationId: number,
	skip: number
) {
	try {
		const data = await fetch(
			process.env.NEXT_PUBLIC_DEFAULT_URL +
				`api/chats/conversation?skip=${skip}&conversationId=${conversationId}`
		)
		return data.json()
	} catch (error) {
		throw new Error('Failed to get conversation data')
	}
}

export async function fetchConversation(
	friendsId: number[]
): Promise<{ id: string }> {
	try {
		const result = await fetch(
			process.env.NEXT_PUBLIC_DEFAULT_URL + '/api/chats/conversation',
			{
				method: 'POST',
				body: JSON.stringify({
					friendsId: friendsId,
				}),
			}
		)
		return result.json()
	} catch (error) {
		throw new Error('Failed to fetch get or create a conversation')
	}
}

export async function updateMessageStatus(
	conversationId: number,
	userId: number
) {
	try {
		const data = await prisma.conversationUser.updateMany({
			where: {
				conversationId: conversationId,
				userId: userId,
			},
			data: {
				messageStatus: 'READ',
			},
		})

		return data
	} catch (error) {
		throw new Error('Failed to update message status')
	}
}

export async function fetchUpdateMessageStatus(conversationId: number) {
	try {
		const data = await fetch(
			process.env.NEXT_PUBLIC_DEFAULT_URL + 'api/chats/message/status',
			{
				method: 'POST',
				body: JSON.stringify({
					conversationId: conversationId,
				}),
			}
		)

		return data.json()
	} catch (error) {
		throw new Error('Failed to fetch update message status')
	}
}

export async function getMessagesStatus(userId: number) {
	try {
		const data = await prisma.conversationUser.findMany({
			where: {
				userId: userId,
				messageStatus: 'UNREAD',
			},
			select: {
				messageStatus: true,
			},
		})
		return data.length || 0
	} catch (error) {
		throw new Error('Failed to update message status')
	}
}
