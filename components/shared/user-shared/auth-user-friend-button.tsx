'use client'

import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const AuthUserFriendButton: React.FC<{
	displayName: string
	friendCount: number
}> = ({ displayName, friendCount }) => {
	const router = useRouter()
	return (
		<Button
			onClick={() => router.push('/friends/' + displayName.slice(1))}
			variant='ghost'
			className='flex items-center w-fit gap-1 pt-1 px-1'
		>
			<Users className='w-4 h-4' />
			<span>{friendCount} friends</span>
		</Button>
	)
}
