'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { LoaderCircle, LogIn, Menu } from 'lucide-react'
import { MobileMenu } from './mobile-menu'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export const MobileBottomSheet: React.FC = () => {
	const [isOpen, setIsOpen] = React.useState(false)
	const { data, status } = useSession()

	if (status === 'loading') {
		return (
			<div className='inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors h-10 px-4 py-2'>
				<LoaderCircle size='25' className='animate-spin' />
			</div>
		)
	}

	if (status === 'unauthenticated' || data === null) {
		return (
			<Link
				className='flex items-center'
				href={process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth'}
			>
				<LogIn />
			</Link>
		)
	}

	return (
		<>
			{isOpen && (
				<div onPointerDown={() => setIsOpen(false)} className='fixed inset-0' />
			)}
			<Button
				className='z-[999999]'
				variant='ghost'
				onClick={() => setIsOpen(prev => !prev)}
			>
				<Menu size='25' />
			</Button>
			<MobileMenu
				closeMenu={() => setTimeout(() => setIsOpen(false), 100)}
				user={data.user}
				isOpen={isOpen}
			/>
		</>
	)
}
