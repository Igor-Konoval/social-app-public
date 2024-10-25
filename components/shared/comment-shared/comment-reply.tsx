'use client'
import { formatRelativeDate } from '@/lib/utils'
import { TypeReplyCommentForPost } from '@/types/post.types'
import { UseMutateFunction } from '@tanstack/react-query'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Button } from '../../ui/button'
import { CreateComment } from './create-comment'
import { useRouter } from 'next/navigation'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const CommentReply: React.FC<
	TypeReplyCommentForPost & {
		incrCounReply?: () => void
	} & {
		createReplyComment: UseMutateFunction<
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
	}
> = ({
	content,
	createdAt,
	id,
	parentCommentId,
	user,
	userId,
	incrCounReply,
	postId,
	receiver,
	createReplyComment,
}) => {
	const [showCreateResponseUser, setShowCreateResponseUser] = useState(false)
	const router = useRouter()
	function btnShowCreateResponseUser() {
		setShowCreateResponseUser(!showCreateResponseUser)
	}
	return (
		<div key={id} className='flex flex-row gap-3'>
			<Avatar
				onClick={() =>
					router.push(
						process.env.NEXT_PUBLIC_DEFAULT_URL +
							'/user/' +
							user.displayName.slice(1)
					)
				}
				className='w-[32px] h-[32px] cursor-pointer'
			>
				<AvatarImage
					src={
						user.avatarUrl
							? user.avatarUrl
							: process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
					}
					alt='User avatar'
				/>
				<AvatarFallback>
					<SkeletonImg />
				</AvatarFallback>
			</Avatar>
			<div className='flex flex-col w-full break-all'>
				<div
					onClick={() =>
						router.push(
							process.env.NEXT_PUBLIC_DEFAULT_URL +
								'/user/' +
								user.displayName.slice(1)
						)
					}
					className='flex flex-row h-fit gap-1 cursor-pointer'
				>
					<h2 className='font-semibold dark:text-white'>{user.username}</h2>
					<span className='dark:text-gray-400'>|</span>
					<h2 className='text-sm text-gray-400'>{user.displayName}</h2>
				</div>
				<div className='flex flex-col'>
					<div className='mt-[3px] dark:text-white'>
						{receiver ? receiver.displayName + ', ' + content : content}
					</div>
					<div className='flex flex-row gap-2'>
						<Button
							onClick={btnShowCreateResponseUser}
							variant='ghost'
							className='p-1 h-fit text-[12px] text-gray-500'
						>
							{showCreateResponseUser ? 'скасувати' : 'дати відповідь'}
						</Button>
						<div className='flex flex-row items-center text-gray-500 text-xs dark:text-gray-400'>
							{formatRelativeDate(createdAt)}
						</div>
					</div>
				</div>
				{showCreateResponseUser && (
					<CreateComment
						className='my-3'
						postId={postId}
						fncClose={() => setShowCreateResponseUser(false)}
						parentCommentId={parentCommentId}
						receiverId={userId}
						incrCounReply={incrCounReply}
						createReplyComment={createReplyComment}
					/>
				)}
			</div>
		</div>
	)
}
