import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonShareItem: React.FC = () => {
	return (
		<div className='flex flex-col space-y-1 rounded-3xl border p-4 items-center px-4'>
			<Skeleton className='h-14 w-14 rounded-full' />
			<div className='flex flex-col justify-center px-4 space-y-1 w-full'>
				<Skeleton className='h-3 w-full' />
				<Skeleton className='h-3 w-full' />
			</div>
		</div>
	)
}
