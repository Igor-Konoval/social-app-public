import { useCommentsPost } from '@/hooks/useCommentsPost'
import {
	CommentItem,
	CreateComment,
	SkeletonCommentItem,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Frown, X } from 'lucide-react'
import { ScrollArea } from '../../ui/scroll-area'
import { Title } from '../../ui/title'

export const Comment: React.FC<{
	postId: number
	btnClose?: () => void
	showCommentList: boolean
	postRef: React.RefObject<HTMLDivElement>
}> = ({ postId, btnClose, showCommentList, postRef }) => {
	const { comments, error, isLoading, createComment } = useCommentsPost(
		postId,
		showCommentList
	)

	if (error) return <div className='dark:text-white'>Сталася помилка</div>

	if (isLoading) {
		return (
			<div className='p-6 space-y-4'>
				<span className='mb-4 flex flex-row flex-nowrap justify-between'>
					<Title size='md' text='Коментарі' className='font-bold' />
					<Button variant='ghost' className='w-fit' onClick={btnClose}>
						<X className='dark:text-white' />
					</Button>
				</span>
				{new Array(4).fill(4).map((_, i) => (
					<SkeletonCommentItem key={i} />
				))}
			</div>
		)
	}

	if (comments) {
		return (
			<div className='pt-6 pb-6 pl-6 pr-0 [@media(max-width:350px)]:pl-2'>
				<span className='mb-4 flex flex-row flex-nowrap justify-between'>
					<Title
						size='md'
						text='Коментарі'
						className='font-bold dark:text-white'
					/>
					<Button variant='ghost' className='w-fit' onClick={btnClose}>
						<X className='dark:text-white' />
					</Button>
				</span>
				{comments.length === 0 ? (
					<div
						className={`flex flex-col justify-center items-center ${
							postRef.current?.offsetHeight
								? 'h-[' + postRef.current?.offsetHeight + 'px]'
								: ''
						} min-h-[200px] max-h-[50vh] md:max-h-[550px]`}
					>
						<p className='text-xl text-gray-400 flex justify-center items-center'>
							Немає коментарів
						</p>
						<Frown size={80} color='#292929' strokeWidth={1.75} />
					</div>
				) : (
					<ScrollArea
						type='always'
						className='overflow-y-auto min-h-[200px] max-h-[50vh] md:max-h-[550px]'
						style={{
							height: postRef.current?.offsetHeight + 'px',
						}}
					>
						<div className='pr-6 space-y-3'>
							{comments?.map(comment => (
								<CommentItem key={comment.id} {...comment} postId={postId} />
							))}
						</div>
					</ScrollArea>
				)}
				<CreateComment
					className='mt-4 w-full pr-6'
					postId={postId}
					createComment={createComment}
				/>
			</div>
		)
	}
}
