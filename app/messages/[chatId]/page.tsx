import { auth } from '@/auth'
import { ChatConversationContent } from '@/components/shared'
import { checkConversation } from '@/services/message.services'
import { AlertCircle } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

export default async function Page({ params }: { params: { chatId: string } }) {
	const session = await auth()

	if (!session) {
		return redirect(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
	}

	if (isNaN(+params.chatId)) {
		return (
			<div className='flex justify-center flex-row items-center h-[30vh] gap-2'>
				<AlertCircle className='w-14 h-14' />{' '}
				<h2 className='text-2xl dark:text-white font-bold text-muted-foreground'>
					Недопустимі дані
				</h2>
			</div>
		)
	}

	const data = await checkConversation(+session.user.id, +params.chatId, 0)

	if (!data) {
		return notFound()
	} else {
		return (
			<ChatConversationContent
				username={session.user.username}
				userId={+session.user.id}
				data={data}
			/>
		)
	}
}
