import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonSidebarItem } from './skeleton-sidebar-item'

export const SkeletonSidebarUser: React.FC = () => {
	return (
		<div className='border pr-[2.02px] border-black-200 rounded-lg flex flex-col h-fit'>
			<div className='flex items-center px-3 pt-2 gap-2'>
				<Skeleton className='h-12 w-12 rounded-full' />
				<div className='flex flex-col'>
					<Skeleton className='h-4 w-[100px]' />
					<Skeleton className='h-4 w-[80px] text-gray-400' />
				</div>
			</div>
			<nav className='space-y-3 w-full'>
				<ul>
					{[...Array(5)].map((_, i) => (
						<li className='px-3 py-[10px]' key={i}>
							<SkeletonSidebarItem />
						</li>
					))}
				</ul>
			</nav>
			<hr />
			<div className='px-3 py-2'>
				<SkeletonSidebarItem />
			</div>
			<div className='px-3 py-2'>
				<SkeletonSidebarItem />
			</div>
		</div>
	)
}
