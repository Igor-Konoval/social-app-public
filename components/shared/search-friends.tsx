'use client'
import { findFriendsByUsernameAndDisplayName } from '@/actions/search.action'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { SkeletonImg } from './skeleton-shared/skeleton-img'

type Friend = {
	id: number
	username: string
	displayName: string
	avatarUrl: string | null
}

export const SearchFriends: React.FC<{ closeDialog?: () => void }> = ({
	closeDialog,
}) => {
	const [searchTerm, setSearchTerm] = useState('')
	const [searchResults, setSearchResults] = useState<Friend[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const searchRef = useRef<HTMLDivElement>(null)

	const handleSearch = useCallback(async (term: string) => {
		if (term.length < 1) {
			setSearchResults([])
			return
		}

		setIsSearching(true)
		try {
			const results = await findFriendsByUsernameAndDisplayName(term)
			setSearchResults(results)
		} catch (error) {
			setSearchResults([])
		} finally {
			setIsSearching(false)
		}
	}, [])

	useEffect(() => {
		const timer = setTimeout(() => {
			handleSearch(searchTerm)
		}, 300)

		return () => clearTimeout(timer)
	}, [searchTerm, handleSearch])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setSearchResults([])
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className='relative' ref={searchRef}>
			<Users
				className='absolute top-1/2 left-2 transform -translate-y-1/2 w-5 h-5'
				color='#919191'
			/>
			<input
				type='text'
				placeholder='Search friends...'
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
				className='px-8 dark:text-black w-full md:w-auto py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300'
			/>
			{isSearching && (
				<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
					<div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500'></div>
				</div>
			)}
			{searchResults.length > 0 && (
				<div className='absolute mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
					{searchResults.map(friend => (
						<Link
							key={friend.id}
							href={
								process.env.NEXT_PUBLIC_DEFAULT_URL +
								'/user/' +
								friend.displayName.slice(1)
							}
							onFocus={() => {
								setTimeout(() => setSearchResults([]), 100)
								closeDialog && closeDialog()
							}}
							className='flex items-center px-4 py-2 hover:bg-gray-100'
						>
							<Avatar className='w-10 h-10 mr-2'>
								<AvatarImage
									src={
										friend.avatarUrl
											? friend.avatarUrl
											: process.env.NEXT_PUBLIC_DEFAULT_URL +
											  'avatar-unknown.jpg'
									}
									alt='User avatar'
								/>
								<AvatarFallback>
									<SkeletonImg />
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col'>
								<span className='dark:text-black'>{friend.username}</span>
								<span className='text-muted-foreground'>
									{friend.displayName}
								</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
