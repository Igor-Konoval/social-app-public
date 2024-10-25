'use client'
import { PostCard } from './post-card'
import { CreatePost } from './create-post'
import { useInfiniteFriendPosts } from '@/hooks/useInfinityFriendPosts'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { AlertCircle, Frown, Loader2 } from 'lucide-react'
import { TypePostCard } from '@/types/post.types'

export const FriendListPosts: React.FC = () => {
	const { ref, inView, entry } = useInView({ threshold: 0.5 })
	const {
		ref: ref2,
		inView: inView2,
		entry: entry2,
	} = useInView({ threshold: 0.5 })

	const {
		data,
		error,
		isLoading,
		isFetchingNextPage,
		refetch,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteFriendPosts(['follow-posts'], 20)
	useEffect(() => {
		if (isFetchingNextPage) return
		if (entry && inView && hasNextPage) {
			fetchNextPage()
		}
	}, [entry, inView, hasNextPage])

	useEffect(() => {
		if (isFetchingNextPage) return
		if (entry2 && inView2 && hasNextPage) {
			fetchNextPage()
		}
	}, [entry2, inView2, hasNextPage])

	if (isLoading) {
		return (
			<div className='flex items-center justify-center w-full lg:w-[600px] h-[100px]'>
				<Loader2 className='w-14 h-14 animate-spin' />
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center gap-2 w-full px-3 lg:w-[600px] lg:px-0 h-[300px]'>
				<AlertCircle className='w-14 h-14' />
				<span className='dark:text-white'>
					Сталася помился, перезавантажте сторінку
				</span>
			</div>
		)
	}

	return (
		<span className='space-y-11'>
			<CreatePost refetch={refetch} />
			{data === undefined ? null : data.pages.flat().length === 0 ? (
				<div className='flex items-center justify-center gap-2 w-full px-3 lg:w-[600px] lg:px-0 h-[300px]'>
					<Frown className='w-14 h-14' /> Жодних постів
				</div>
			) : (
				(data.pages.flat() as TypePostCard[]).map((post, i) => (
					<div
						className='flex justify-center lg:justify-start'
						ref={i === data.pages.flat().length - 11 ? ref : null}
						key={post.id}
					>
						<PostCard {...post} key={post.id} />
					</div>
				))
			)}
			{isFetchingNextPage && (
				<div className='flex items-center justify-center w-full lg:w-[600px] h-[100px]'>
					<Loader2 className='w-14 h-14 animate-spin' />
				</div>
			)}
			<span className='h-1 w-10' ref={ref2} />
		</span>
	)
}
