import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonSidebarItem: React.FC = () => {
	return (
		<div className='flex items-center gap-2'>
			<Skeleton className='h-6 w-6 rounded-full' />
			<Skeleton className='h-4 w-[100px]' />
		</div>
	)
}
