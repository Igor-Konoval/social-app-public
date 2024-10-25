import { cn } from '@/lib/utils'
import { Container } from './container'
import Image from 'next/image'
import Link from 'next/link'
import { SearchFriends } from './search-friends'

type Props = {
	className?: string
}

export const Header: React.FC<Props> = ({ className }) => {
	return (
		<header
			className={cn(
				'bg-white dark:bg-[#212121] fixed top-0 left-0 right-0 z-50 h-[80px]',
				className
			)}
		>
			<Container className='h-full'>
				<div className='flex flex-row items-center justify-between h-full'>
					<Link className='flex items-center' href='/'>
						<Image
							src='/144x144.png'
							className='dark:hidden'
							alt='Logo'
							width={80}
							height={80}
						/>
						<Image
							src='/144x144_dark.png'
							className='hidden dark:block'
							alt='Logo'
							width={80}
							height={80}
						/>
						<h1 className='text-3xl font-bold pl-3'>Lin-Social</h1>
					</Link>
					<div className='flex items-center justify-center mr-[200px]'>
						<SearchFriends />
					</div>
				</div>
			</Container>
		</header>
	)
}
