'use client'
import {
	Comment,
	PostImg,
	PostImgCarousel,
	PostOpenShareComponent,
	SkeletonImg,
} from '@/components/shared'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatRelativeDate } from '@/lib/utils'
import type { TypePostCard } from '@/types/post.types'
import { Bookmark, Heart, MessageCircle } from 'lucide-react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../../ui/card'
import {
	fetchAddSavePost,
	fetchRemoveSavePost,
	handleClickReaction,
} from '@/services/post.services'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { $Enums } from '@prisma/client'
import { useRouter } from 'next/navigation'

export const PostCard: React.FC<TypePostCard> = ({
	id,
	user,
	content,
	imageUrl,
	createdAt,
	reactions,
	_count,
	savedPost,
}) => {
	const [reaction, setReaction] = useState<
		$Enums.ReactionProperties | undefined
	>(undefined)
	const [isSavedPost, setIsSavedPost] =
		useState<TypePostCard['savedPost']>(savedPost)

	const [showCommentList, setShowCommentList] = useState(false)
	const [postPosition, setPostPosition] = useState({
		top: 0,
		left: 0,
		right: 0,
	})

	const router = useRouter()
	const postRef = useRef<null | HTMLDivElement>(null) // Ref для поста
	const timeBlock = useRef(false)

	const { data, status } = useSession()

	const resizeCommentList = (nextShowCommentList = showCommentList) => {
		if (postRef.current) {
			const rect = postRef.current.getBoundingClientRect()
			setPostPosition({
				top: rect.top + window.scrollY,
				left: rect.right,
				right: rect.right - (rect.width + 500),
			})

			const shouldBlockScroll = rect.right - (rect.width + 500) < 110
			document.body.classList.toggle(
				'overflow-hidden',
				shouldBlockScroll && nextShowCommentList
			)
		}
	}

	const handleResize = () => {
		resizeCommentList(showCommentList)
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [showCommentList])

	useEffect(() => {
		return () => document.body.classList.remove('overflow-hidden')
	}, [])

	const openComments = () => {
		if (postRef.current) {
			const nextShowCommentList = !showCommentList
			setShowCommentList(nextShowCommentList)
			resizeCommentList(nextShowCommentList)

			if (nextShowCommentList) {
				const rect = postRef.current.getBoundingClientRect()
				window.scrollTo({
					top: rect.top + window.scrollY - 80,
					behavior: 'smooth',
				})
			}
		}
	}

	function clickReaction() {
		if (status === 'unauthenticated') {
			router.push(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
			return false
		}
		if (status === 'loading') return false
		if (data) {
			handleClickReaction(
				timeBlock,
				id,
				status,
				data?.user.id,
				reaction,
				setReaction,
				reactions,
				_count
			)
		}
	}

	async function clickSavedPost() {
		if (status === 'unauthenticated') {
			router.push(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
			return false
		}
		if (status === 'loading') return false
		if (data) {
			if (timeBlock.current) return
			timeBlock.current = true
			if (isSavedPost) {
				if (isSavedPost.length === 0) {
					const res = await fetchAddSavePost(id)
					if (res) {
						setIsSavedPost([res.id])
					}
				} else {
					const res = await fetchRemoveSavePost(id)
					if (res) {
						setIsSavedPost([])
					}
				}
			}
			timeBlock.current = false
		}
	}

	useEffect(() => {
		if (data?.user.id) {
			setReaction(
				reactions.find(reaction => reaction.userId === +data?.user.id)?.reaction
			)
		}
	}, [data])

	return (
		<Card
			ref={postRef}
			className='w-[90%] dark:border-[#878787] dark:bg-[#212121] sm:w-[500px] md:w-[450px] lg:w-[600px]'
		>
			{showCommentList && postPosition.right <= 110 && (
				<div
					onClick={openComments}
					className='hidden [@media(max-width:1750px)]:block z-10 fixed top-0 left-0 w-full h-full overflow-hidden bg-gray-500/50'
				/>
			)}
			<CardHeader className='flex flex-nowrap flex-row items-center pt-4 gap-3 font-semibold'>
				<Avatar
					className='cursor-pointer w-[52px] h-[52px]'
					onClick={() =>
						router.push(
							process.env.NEXT_PUBLIC_DEFAULT_URL +
								'user/' +
								user.displayName.slice(1)
						)
					}
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
				<div className='flex flex-col'>
					<div
						onClick={() =>
							router.push(
								process.env.NEXT_PUBLIC_DEFAULT_URL +
									'/user/' +
									user.displayName.slice(1)
							)
						}
						className='flex flex-row gap-1 cursor-pointer'
					>
						<h2 className='dark:text-white'>{user.username}</h2>
						<span className='dark:text-gray-400'>|</span>
						<CardTitle className='text-sm text-gray-400'>
							{user.displayName}
						</CardTitle>
					</div>
					<div className='text-sm text-gray-400'>
						{formatRelativeDate(createdAt)}
					</div>
				</div>
			</CardHeader>
			<CardContent
				onDoubleClick={clickReaction}
				onMouseDown={() => false}
				className='text-xl dark:text-white'
			>
				{content}
			</CardContent>
			{imageUrl.length > 1 && (
				<CardContent
					onDoubleClick={clickReaction}
					className='flex justify-center p-0 [@media(min-width:500px)]:p-6'
				>
					<PostImgCarousel imageUrl={imageUrl} />
				</CardContent>
			)}
			{imageUrl.length === 1 && (
				<CardContent
					onDoubleClick={clickReaction}
					className='flex justify-center'
				>
					<PostImg imageUrl={imageUrl[0]} />
				</CardContent>
			)}
			<hr className='mb-3 dark:border-t-[0.3px] dark:border-[#9d9d9d]' />
			<CardFooter className='flex justify-around [@media(max-width:400px)]:px-0 pb-3'>
				<div className='flex flex-row gap-7'>
					<Button
						onClick={clickReaction}
						variant='ghost'
						className='w-fit gap-2 [@media(max-width:400px)]:px-2'
					>
						<Heart
							color={reaction === 'HEART' ? 'red' : 'black'}
							strokeWidth={reaction === 'HEART' ? 2 : 2}
							fill={reaction === 'HEART' ? 'red' : 'white'}
						/>{' '}
						{_count.reactions ? (
							<span className='text-[17px] text-[#858585]'>
								{_count.reactions}
							</span>
						) : null}
					</Button>
					<Button
						onClick={() => openComments()}
						variant='ghost'
						className='w-fit [@media(max-width:400px)]:gap-0 gap-2 [@media(max-width:400px)]:px-2'
					>
						<MessageCircle fill='white' />{' '}
						{_count.comments ? (
							<span className='text-[17px] text-[#858585] [@media(max-width:400px)]:px-2'>
								{_count.comments}
							</span>
						) : null}
					</Button>
					<div
						className={`[@media(max-width:1750px)]:left-auto absolute w-[92%] sm:w-[500px] dark:bg-[#212121] space-y-3 rounded-md bg-white shadow-md z-[49] border border-gray-300 transition-transform duration-300 ease-in-out transform-gpu origin-left ${
							showCommentList
								? postPosition.right > 110
									? 'scale-x-100 opacity-100'
									: 'scale-x-100 opacity-100 -translate-x-1/2'
								: 'scale-x-0 opacity-0'
						}`}
						style={{
							visibility: showCommentList ? 'visible' : 'hidden',
							left: postPosition.right > 110 ? postPosition.left + 'px' : '50%',
							top: postRef.current
								? postRef.current.clientHeight < 850 //если высота поста меньше 850
									? postPosition.top + 'px'
									: postPosition.top + 100 + 'px'
								: postPosition.top + 'px',
						}}
					>
						<Comment
							postRef={postRef}
							showCommentList={showCommentList}
							btnClose={openComments}
							postId={id}
						/>
					</div>
					<PostOpenShareComponent
						postId={id}
						userId={data?.user && +data.user.id}
						userStatus={status}
						content={content || ''}
						imageUrl={imageUrl[0]}
						postUsername={user.username}
						postUserAvatarUrl={user.avatarUrl || undefined}
					/>
				</div>
				<Button
					onClick={clickSavedPost}
					variant='ghost'
					className='w-fit [@media(max-width:400px)]:px-2'
				>
					<Bookmark
						className='dark:stroke-[#474747] dark:hover:stroke-black'
						fill={
							isSavedPost !== undefined
								? isSavedPost.length === 0
									? 'white'
									: 'black'
								: 'white'
						}
					/>
				</Button>
			</CardFooter>
		</Card>
	)
}
