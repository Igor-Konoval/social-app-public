import { getSavedPosts } from '@/services/post.services'
import type { $Enums, Post } from '@prisma/client'

export type TypePost = Omit<Post, 'updatedAt'>

export type TypePostCard = Omit<TypePost, 'userId'> & {
	user: {
		displayName: string
		avatarUrl: string | null
		username: string
	}
	reactions: {
		userId: number
		reaction: $Enums.ReactionProperties
	}[]
	savedPost?: {
		id: number
	}[]
	_count: {
		reactions: number
		comments: number
	}
}

export type TypeCommentForPost = {
	user: {
		id: number
		username: string
		displayName: string
		avatarUrl: string | null
	}
	_count: {
		replies: number
	}
} & {
	id: number
	content: string
	createdAt: Date
	updatedAt: Date
	postId: number
	userId: number
	parentCommentId: number | null
}

export type TypeReplyCommentForPost = Omit<TypeCommentForPost, '_count'> & {
	receiverId: number | null
} & {
	receiver: {
		id: number
		displayName: string
	} | null
}

export type TypeSavedPosts = Awaited<ReturnType<typeof getSavedPosts>>
