import { prisma } from '@/prisma/prisma-client'
import type {
	TypeCommentForPost,
	TypePostCard,
	TypeReplyCommentForPost,
} from '@/types/post.types'
import { $Enums, ReactionProperties } from '@prisma/client'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { createNotification } from './notification.services'
import { sendNotification } from '@/actions/notification.action'

export async function createPost(
	content: string,
	userId: number,
	imageUrl?: string[]
) {
	try {
		const data = await prisma.post.create({
			data: {
				content,
				userId,
				imageUrl,
			},
			include: {
				user: {
					select: {
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
			},
		})
		if (data) {
			return true
		} else {
			return false
		}
	} catch (error) {
		throw new Error('Failed to create post')
	}
}

export async function fetchCreatePost(formData: FormData): Promise<boolean> {
	try {
		const data: boolean = await fetch('/api/posts/create', {
			method: 'POST',
			body: formData,
		}).then(res => res.json())

		return data
	} catch (error) {
		throw new Error('Failed to create post')
	}
}

export async function getFriendPosts(
	limit: number,
	userId: number,
	skip: number
) {
	try {
		const friendPosts = await prisma.post.findMany({
			where: {
				user: {
					OR: [
						{ friends: { some: { userId: userId } } },
						{ friendOf: { some: { friendId: userId } } },
					],
				},
			},
			include: {
				user: {
					select: {
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
				reactions: {
					select: {
						reaction: true,
						userId: true,
					},
				},
				savedPost: {
					where: {
						userId,
					},
					select: {
						id: true,
					},
				},
				_count: {
					select: {
						reactions: true,
						comments: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
			skip,
		})

		return friendPosts
	} catch (error) {
		throw new Error('Failed to get friend posts')
	}
}

export async function getAllPostIds() {
	try {
		const data = await prisma.post.findMany({
			select: {
				id: true,
			},
		})
		return data
	} catch (error) {
		throw new Error('Failed to get all post ids')
	}
}

export async function getPostById(id: number) {
	try {
		const publicPosts = await prisma.post.findFirst({
			where: {
				id,
			},
			include: {
				user: {
					select: {
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
				reactions: {
					select: {
						reaction: true,
						userId: true,
					},
				},
				_count: {
					select: {
						reactions: true,
						comments: true,
					},
				},
			},
		})
		return publicPosts
	} catch (error) {
		throw new Error('Failed to get public posts')
	}
}

export async function postShare(
	postId: number,
	userId: number,
	content: string,
	conversationIds: string[] | null,
	friendIds: string[] | null,
	imageUrl: string,
	postUsername: string,
	postUserAvatarUrl: string
) {
	try {
		if (conversationIds) {
			const toSend = conversationIds.map(item => ({
				messageVariant: $Enums.MessageVariant['POST'],
				postId,
				userId,
				postUserAvatarUrl,
				postUsername,
				content,
				imageUrl,
				conversationId: +item,
			}))

			await prisma.message.createMany({
				data: toSend,
			})

			const updateMessageStatus = conversationIds.map(item => +item)

			await prisma.conversationUser.updateMany({
				where: {
					conversationId: { in: updateMessageStatus },
					userId: { not: userId },
				},
				data: {
					messageStatus: 'UNREAD',
				},
			})
		}

		if (friendIds) {
			const toSend = friendIds.map(
				async item =>
					await prisma.conversation.create({
						data: {
							variant: 'ONETOONE',
							users: {
								createMany: {
									data: [
										{
											userId,
										},
										{
											userId: +item,
										},
									],
								},
							},
							messages: {
								create: {
									messageVariant: 'POST',
									postId,
									userId,
									postUserAvatarUrl,
									postUsername,
									content,
									imageUrl,
								},
							},
						},
						select: {
							id: true,
						},
					})
			)
			const data = await Promise.all(toSend)
			const update = data.map(item => item.id)
			await prisma.conversationUser.updateMany({
				where: {
					conversationId: { in: update },
					userId: { not: userId },
				},
				data: {
					messageStatus: 'UNREAD',
				},
			})
		}

		return true
	} catch (error) {
		throw new Error('Failed to get public posts')
	}
}

export async function fetchPostShare(
	postId: number,
	userId: number,
	content: string,
	conversationIds: number[] | null,
	friendIds: number[] | null,
	imageUrl: string | null,
	postUsername: string,
	postUserAvatarUrl: string | undefined
): Promise<boolean> {
	try {
		const data = await fetch(
			process.env.NEXT_PUBLIC_DEFAULT_URL + 'api/posts/share',
			{
				method: 'POST',
				body: JSON.stringify({
					postId,
					userId,
					content,
					conversationIds,
					friendIds,
					imageUrl,
					postUsername,
					postUserAvatarUrl,
				}),
			}
		)
		return data.json()
	} catch (error) {
		throw new Error('Failed to fetch shared post')
	}
}

export async function getPublicPosts(limit: number, skip: number) {
	try {
		const publicPosts = await prisma.post.findMany({
			include: {
				user: {
					select: {
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
				reactions: {
					select: {
						reaction: true,
						userId: true,
					},
				},
				_count: {
					select: {
						reactions: true,
						comments: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
			skip,
		})

		return publicPosts
	} catch (error) {
		throw new Error('Failed to get public posts')
	}
}

export async function getAuthPublicPosts(
	limit: number,
	userId: number,
	skip: number
) {
	try {
		const publicPosts = await prisma.post.findMany({
			include: {
				user: {
					select: {
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
				reactions: {
					where: {
						userId,
					},
					select: {
						reaction: true,
						userId: true,
					},
				},
				savedPost: {
					where: {
						userId,
					},
					select: {
						id: true,
					},
				},
				_count: {
					select: {
						reactions: true,
						comments: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
			skip,
		})

		return publicPosts
	} catch (error) {
		throw new Error('Failed to get public posts')
	}
}

export async function reactionsForPost(
	postId: number,
	userId: number,
	reaction: ReactionProperties
) {
	try {
		const data = await prisma.postReaction.create({
			data: {
				postId,
				userId,
				reaction,
			},
		})
		return data
	} catch (error: any) {
		throw new Error('Failed to like post')
	}
}

export async function removeReaction(postId: number, userId: number) {
	try {
		await prisma.postReaction.delete({
			where: {
				postId_userId: {
					postId: postId,
					userId: userId,
				},
			},
		})
		return true
	} catch (error: any) {
		throw new Error(`Ошибка при удалении реакции: ${error.message}`)
	}
}

export async function getListPosts(skip: number): Promise<TypePostCard[]> {
	return fetch('/api/posts/social' + `?skip=${skip}`).then(res => res.json())
}

export async function getFriendListPosts(
	skip: number
): Promise<TypePostCard[]> {
	return fetch('/api/posts/for-me' + `?skip=${skip}`).then(res => res.json())
}

export async function fetchReactionsForPost(
	postId: number,
	reaction: ReactionProperties = 'HEART'
): Promise<{
	id: number
	reaction: $Enums.ReactionProperties
	userId: number
	postId: number
}> {
	try {
		return fetch('/api/posts/like-post', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postId,
				reaction,
			}),
		}).then(res => res.json())
	} catch (error: any) {
		throw new Error('Failed to like post')
	}
}

export async function fetchRemoveReactionsPost(
	postId: number
): Promise<boolean> {
	try {
		return fetch('/api/posts/remove-like-post', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postId,
			}),
		}).then(res => res.json())
	} catch (error: any) {
		throw new Error('Failed to remove like post')
	}
}

export const handleClickReaction = async (
	timeBlock: MutableRefObject<boolean>,
	id: number,
	status: 'authenticated' | 'unauthenticated' | 'loading',
	userId: string,
	reaction: $Enums.ReactionProperties | undefined,
	setReaction: Dispatch<SetStateAction<$Enums.ReactionProperties | undefined>>,
	reactions: {
		userId: number
		reaction: $Enums.ReactionProperties
	}[],
	_count: { reactions: number }
) => {
	if (timeBlock.current) {
		return false
	}
	if (status === 'authenticated') {
		if (reaction === 'HEART') {
			timeBlock.current = true
			const res = await fetchRemoveReactionsPost(id)
			if (res === true) {
				const updatedReactions = reactions.findIndex(
					reaction => reaction.userId !== +userId
				)
				reactions.splice(updatedReactions, 1)
				setReaction(undefined)
				_count.reactions--
				timeBlock.current = false
			}
		} else {
			timeBlock.current = true
			const res = await fetchReactionsForPost(id, 'HEART')
			if (res) {
				setReaction(res.reaction)
				reactions.push({
					userId: res.userId,
					reaction: res.reaction,
				})
				_count.reactions++
				timeBlock.current = false
			}
		}
	}
}

export async function createCommentPost(
	postId: number,
	userId: number,
	content: string
) {
	try {
		const data = await prisma.comment.create({
			data: {
				postId: postId,
				content: content,
				userId: userId,
			},
			include: {
				user: {
					select: {
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
				post: {
					select: {
						userId: true,
						content: true,
					},
				},
				_count: {
					select: {
						replies: true,
					},
				},
			},
		})
		const notifContent = `Новий коментар під постом ${
			content.length > 20 ? content.slice(0, 20) + '...' : content
		}`

		await createNotification(
			data.post.userId,
			notifContent,
			true,
			postId.toString()
		)

		sendNotification(data.post.userId, notifContent)
		return data
	} catch (error: any) {
		throw new Error(`Ошибка при добавлении комментария: ${error.message}`)
	}
}

export async function fetchCreateCommentsPost(
	postId: number,
	content: string
): Promise<TypeCommentForPost> {
	try {
		return fetch('/api/posts/comment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postId,
				content,
			}),
		}).then(res => res.json())
	} catch (error: any) {
		throw new Error('Failed to create comment post')
	}
}

export async function createReplyCommentPost(
	postId: number,
	userId: number,
	content: string,
	parentCommentId: number,
	receiverId: number
) {
	try {
		const data = await prisma.comment.create({
			data: {
				postId: postId,
				content: content,
				userId: userId,
				parentCommentId: parentCommentId,
				receiverId,
			},
			include: {
				user: {
					select: {
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
				receiver: {
					select: {
						id: true,
						displayName: true,
					},
				},
			},
		})
		const notifContent = `Відповідь на коментар ${
			content.length > 8 ? content.slice(0, 8) + '...' : content
		}`
		await createNotification(receiverId, notifContent, true, postId.toString())
		sendNotification(receiverId, notifContent)
		return data
	} catch (error: any) {
		throw new Error(`Сталася помилка при створенні коментаря`)
	}
}

export function fetchCreateReplyCommentPost(
	postId: number,
	content: string,
	parentCommentId: number,
	receiverId: number
): Promise<TypeReplyCommentForPost> {
	try {
		return fetch('/api/posts/comment/replies', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postId,
				content,
				parentCommentId,
				receiverId,
			}),
		}).then(res => res.json())
	} catch (error: any) {
		throw new Error('Failed to create reply comment')
	}
}

export function fetchGetCommentsPost(
	postId: number
): Promise<TypeCommentForPost[]> {
	try {
		return fetch('/api/posts/comment?query=' + postId, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(res => res.json())
	} catch (error: any) {
		throw new Error('Failed to get comments post')
	}
}

export async function getCommentsPost(postId: number) {
	try {
		const comments = await prisma.comment.findMany({
			where: {
				postId,
				parentCommentId: null, // Получаем только корневые комментарии
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
				_count: {
					select: {
						replies: true,
					},
				},
			},
			orderBy: {
				createdAt: 'asc',
			},
		})
		return comments
	} catch (error: any) {
		throw new Error(`Ошибка при получении комментариев: ${error.message}`)
	}
}

export function fetchGetRepliesCommentPost(
	id: number
): Promise<TypeReplyCommentForPost[]> {
	try {
		return fetch('/api/posts/comment/replies?query=' + id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(res => res.json())
	} catch (error: any) {
		throw new Error('Failed to get comments post')
	}
}

export async function getRepliesCommentPost(parentCommentId: number) {
	try {
		const comments = await prisma.comment.findMany({
			where: {
				parentCommentId,
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						displayName: true,
						avatarUrl: true,
					},
				},
				receiver: {
					select: {
						id: true,
						displayName: true,
					},
				},
			},
			orderBy: {
				createdAt: 'asc',
			},
		})
		return comments
	} catch (error: any) {
		throw new Error(`Ошибка при получении комментариев: ${error.message}`)
	}
}

export async function fetchAddSavePost(postId: number) {
	try {
		return fetch('/api/posts/saved-post', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ postId }),
		}).then(res => res.json())
	} catch (error: any) {
		throw new Error('Failed to fetch add save post')
	}
}

export async function addSavePost(postId: number, userId: number) {
	try {
		const data = await prisma.savedPost.create({
			data: {
				postId,
				userId,
			},
		})
		return data
	} catch (error: any) {
		throw new Error('Failed to add save post')
	}
}

export async function fetchRemoveSavePost(postId: number) {
	try {
		return fetch('/api/posts/saved-post', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ postId }),
		}).then(res => res.json())
	} catch (error: any) {
		throw new Error('Failed to fetch remove save post')
	}
}

export async function removeSavePost(postId: number, userId: number) {
	try {
		await prisma.savedPost.delete({
			where: {
				userId_postId: {
					postId,
					userId,
				},
			},
		})
		return true
	} catch (error: any) {
		throw new Error('Failed to remove save post')
	}
}

export async function getSavedPosts(userId: number) {
	try {
		const data = await prisma.savedPost.findMany({
			where: {
				userId,
			},
			include: {
				post: {
					select: {
						content: true,
						id: true,
						imageUrl: true,
						_count: {
							select: {
								reactions: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return data
	} catch (error: any) {
		throw new Error('Failed to get saved posts')
	}
}
