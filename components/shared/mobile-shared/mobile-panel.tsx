import { Home } from 'lucide-react'
import { Button } from '../../ui/button'
import { MobileBottomSheet } from './mobile-bottom-sheet'
import Link from 'next/link'
import { MobileSearchFriends } from './mobile-search-friends'

export const MobilePanel: React.FC = () => {
	return (
		<div className='fixed h-[50px] w-full bg-white dark:bg-black bottom-0 flex flex-row flex-nowrap justify-around items-center md:hidden mobile-panel'>
			<Button variant='ghost'>
				<Link className='flex items-center' href='/'>
					<Home size={25} />
				</Link>
			</Button>
			<MobileSearchFriends />
			<MobileBottomSheet />
		</div>
	)
}
