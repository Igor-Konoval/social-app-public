'use client'
import { Button } from '@/components/ui/button'
import { fetchOneToOneConversation } from '@/services/message.services'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const AuthUserProfileButtonMessage: React.FC<{ id: number }> = ({
	id,
}) => {
	const router = useRouter()
	return (
		<Button
			className='rounded-2xl [@media(max-width:350px)]:px-3 gap-2 font-semibold'
			variant='secondary'
			onClick={async () => {
				const result = await fetchOneToOneConversation(id)
				if (result) {
					router.push(
						process.env.NEXT_PUBLIC_DEFAULT_URL + '/messages/t/' + result.id
					)
				}
			}}
		>
			<MessageCircle className='w-6 h-6' /> Написати
		</Button>
	)
}
