'use client'
import { useRepliesCommentPost } from '@/hooks/useRepliesCommentPost'
import { formatRelativeDate } from '@/lib/utils'
import { TypeCommentForPost } from '@/types/post.types'
import { ArrowDown } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Button } from '../../ui/button'
import {
	CommentReply,
	CreateComment,
	SkeletonCommentItem,
	SkeletonImg,
} from '@/components/shared/'
import { useRouter } from 'next/navigation'

export const CommentItem: React.FC<
	TypeCommentForPost & {
		postId: number
	}
> = comment => {
	const [showCreateResponseUser, setShowCreateResponseUser] = useState(false)
	const [showResponsesUser, setShowResponsesUser] = useState(false)
	const router = useRouter()

	const { replies, isLoading, createReplyComment } = useRepliesCommentPost(
		comment.id,
		showResponsesUser
	)

	function incrCounReply() {
		comment._count.replies++
	}

	function btnShowCreateResponseUser() {
		setShowCreateResponseUser(!showCreateResponseUser)
	}

	function btnShowResponsesUser() {
		setShowResponsesUser(!showResponsesUser)
	}

	return (
		<div key={comment.id} className='flex flex-row gap-3'>
			<Avatar
				onClick={() =>
					router.push(
						process.env.NEXT_PUBLIC_DEFAULT_URL +
							'/user/' +
							comment.user.displayName.slice(1)
					)
				}
				className='cursor-pointer'
			>
				<AvatarImage
					src={
						comment.user.avatarUrl
							? comment.user.avatarUrl
							: process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
					}
					alt='User avatar'
				/>
				<AvatarFallback>
					<SkeletonImg />
				</AvatarFallback>
			</Avatar>
			<div className='flex flex-col w-full [@media(max-width:350px)]:text-sm'>
				<div className='flex flex-row h-fit gap-1'>
					<span
						className='flex flex-row h-fit gap-1 cursor-pointer break-all'
						onClick={() =>
							router.push(
								process.env.NEXT_PUBLIC_DEFAULT_URL +
									'/user/' +
									comment.user.displayName.slice(1)
							)
						}
					>
						<h2 className='font-semibold dark:text-white'>
							{comment.user.username}
						</h2>
						<span className='dark:text-gray-400'>|</span>
						<h2 className='text-sm text-gray-400'>
							{comment.user.displayName}
						</h2>
					</span>
					<div className='hidden sm:flex sm:flex-row sm:items-center  text-gray-500 text-xs dark:text-gray-400'>
						{formatRelativeDate(comment.createdAt)}
					</div>
				</div>
				<div className='flex flex-col'>
					<div className='mt-[3px] dark:text-white break-all'>
						{comment.content}
					</div>
					<div className='flex flex-row items-center sm:hidden text-gray-500 text-xs dark:text-gray-400'>
						{formatRelativeDate(comment.createdAt)}
					</div>
					<div className='flex flex-row gap-2'>
						<Button
							onClick={btnShowCreateResponseUser}
							variant='ghost'
							className='p-1 h-fit text-[12px] text-gray-500'
						>
							{showCreateResponseUser ? 'скасувати' : 'дати відповідь'}
						</Button>
						{comment._count.replies !== 0 && (
							<Button
								onClick={btnShowResponsesUser}
								variant='ghost'
								className='p-1 h-fit text-[12px] text-gray-500'
							>
								<ArrowDown size={17} strokeWidth={3} />
								{`відповідей ${comment._count.replies}`}
							</Button>
						)}
					</div>
					{showResponsesUser && isLoading && (
						<div className='mt-3 flex flex-col gap-2 space-y-3'>
							{new Array(4).fill(4).map((_, i) => (
								<SkeletonCommentItem key={i} />
							))}
						</div>
					)}
					{showCreateResponseUser && (
						<CreateComment
							className='my-3'
							postId={comment.postId}
							fncClose={() => setShowCreateResponseUser(false)}
							parentCommentId={comment.id}
							incrCounReply={incrCounReply}
							receiverId={comment.userId}
							createReplyComment={createReplyComment}
						/>
					)}
					{showResponsesUser && replies && (
						<div className='relative left-[-23px] mt-3 flex flex-col gap-2 space-y-3'>
							{replies.map((reply, i) => (
								<CommentReply
									createReplyComment={createReplyComment}
									incrCounReply={incrCounReply}
									key={i}
									{...reply}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
