import { Skeleton } from '@/components/ui/skeleton'
import { Title } from '../../ui/title'

export const SkeletonSidebarSocial: React.FC = () => {
	return (
		<div className='border border-black-200 rounded-lg h-fit'>
			<Title size='sm' className='py-2 px-4' text='Social' />
			<hr className='mb-2' />
			<ul className='space-y-1'>
				{Array(5)
					.fill(5)
					.map((_, i) => (
						<li
							className='flex items-center font-semibold gap-2 px-3 py-2'
							key={i}
						>
							<Skeleton className='h-10 w-10 rounded-full' />
							<div className='flex flex-col'>
								<Skeleton className='h-4 w-[100px]' />
								<Skeleton className='h-4 w-[80px]' />
							</div>
						</li>
					))}
			</ul>
		</div>
	)
}
