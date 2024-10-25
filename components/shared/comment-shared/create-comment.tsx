'use client'
import { cn } from '@/lib/utils'
import { TypeCommentForPost, TypeReplyCommentForPost } from '@/types/post.types'
import { UseMutateFunction } from '@tanstack/react-query'
import { SendHorizontal } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Button } from '../../ui/button'
import { Textarea } from '../../ui/textarea'
import { useRouter } from 'next/navigation'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const CreateComment: React.FC<{
	className?: string
	postId: number
	parentCommentId?: number | null
	incrCounReply?: () => void
	fncClose?: () => void
	receiverId?: number | null
	createReplyComment?: UseMutateFunction<
		TypeReplyCommentForPost,
		Error,
		{
			postId: number
			content: string
			parentCommentId: number
			receiverId: number
		},
		unknown
	>
	createComment?: UseMutateFunction<
		TypeCommentForPost,
		Error,
		{
			postId: number
			content: string
		},
		unknown
	>
}> = ({
	className,
	postId,
	createComment,
	createReplyComment,
	parentCommentId,
	incrCounReply,
	receiverId,
	fncClose,
}) => {
	const [content, setContent] = useState('')
	const { data, status } = useSession()
	const router = useRouter()
	return (
		<div className={cn('flex flex-row flex-nowrap gap-4', className)}>
			<Avatar>
				<AvatarImage
					src={
						data?.user.avatarUrl
							? data.user.avatarUrl
							: process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
					}
					alt='User avatar'
				/>
				<AvatarFallback>
					<SkeletonImg />
				</AvatarFallback>
			</Avatar>
			<span className='flex gap-1 flex-row w-full'>
				<Textarea
					className='dark:text-white'
					onChange={e => setContent(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter' && !e.shiftKey && content) {
							if (status === 'unauthenticated') {
								router.push(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
								return false
							}
							if (status === 'loading') return false
							e.preventDefault()
							if (createComment) {
								createComment({ postId, content })
							}
							if (createReplyComment && parentCommentId && receiverId) {
								createReplyComment({
									postId,
									content,
									parentCommentId,
									receiverId,
								})
								incrCounReply?.()
							}
							setContent('')
							fncClose?.()
						}
					}}
					value={content}
					placeholder='Ваш коментар'
				/>
				<Button
					onClick={() => {
						if (status === 'unauthenticated') {
							router.push(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
							return false
						}
						if (status === 'loading') return false
						if (!content) return
						if (createComment) {
							createComment({ postId, content })
						}
						if (createReplyComment && parentCommentId && receiverId) {
							createReplyComment({
								postId,
								content,
								parentCommentId,
								receiverId,
							})
							incrCounReply?.()
						}

						setContent('')
						fncClose?.()
					}}
					className='px-2 py-1 md:py-2 md:px-4 ml-auto gap-1'
					variant='destructive'
				>
					<SendHorizontal className='w-4 h-4 md:w-5 md:h-5' strokeWidth={1.5} />
				</Button>
			</span>
		</div>
	)
}
