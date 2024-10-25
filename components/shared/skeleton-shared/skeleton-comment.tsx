import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonCommentItem: React.FC = () => {
	return (
		<div className='flex items-center gap-2'>
			<Skeleton className='h-8 w-8 rounded-full' />
			<div className='flex flex-col space-y-1 w-full'>
				<Skeleton className='h-3 w-[80%]' />
				<Skeleton className='h-3 w-full' />
			</div>
		</div>
	)
}
