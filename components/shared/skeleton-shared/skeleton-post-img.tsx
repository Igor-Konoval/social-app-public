import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonPostImg: React.FC<{ className?: string }> = ({
	className,
}) => {
	return (
		<div className={className}>
			<Skeleton className='w-full h-full' />
		</div>
	)
}
