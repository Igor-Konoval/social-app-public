'use client'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Auth } from '@/components/shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export const ModalAuth: React.FC = () => {
	const router = useRouter()
	const { status } = useSession()
	const handleOpenChange = () => {
		router.back()
	}

	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/')
		}
	}, [status])

	return (
		<Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
			<DialogContent className='flex flex-row justify-center sm:max-w-[550px] bg-white'>
				<DialogHeader className='w-fit'>
					<Auth />
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
