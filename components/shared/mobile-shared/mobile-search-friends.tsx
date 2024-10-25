'use client'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { SearchFriends } from '../search-friends'
import { Search } from 'lucide-react'
import { useState } from 'react'

export const MobileSearchFriends: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<Dialog open={isOpen} onOpenChange={open => setIsOpen(open)}>
			<DialogTrigger className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [@media(hover:none)]:active:bg-accent [@media(hover:hover)]:hover:bg-accent [@media(hover:none)]:active:text-accent-foreground [@media(hover:hover)]:hover:text-accent-foreground h-10 px-4 py-2'>
				<Search size={25} />
			</DialogTrigger>

			<DialogContent className='bg-white dark:bg-[#242424] top-[12%] rounded-md sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Знайти</DialogTitle>
					<DialogDescription className='dark:font-semibold dark:text-gray-400'>
						Пошук користувачів і друзів
					</DialogDescription>
				</DialogHeader>
				<SearchFriends
					closeDialog={() => setTimeout(() => setIsOpen(false), 100)}
				/>
			</DialogContent>
		</Dialog>
	)
}
