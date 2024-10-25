import { auth } from '@/auth'
import { ChatOneToOneContent } from '@/components/shared'
import { checkOneToOneConversation } from '@/services/message.services'
import { AlertCircle } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
// export const revalidate = 6
// export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'
export default async function Page({ params }: { params: { chatId: string } }) {
	const session = await auth()
	if (!session) {
		return redirect(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
	}

	if (isNaN(+params.chatId)) {
		return (
			<div className='flex justify-center flex-row items-center h-[30vh] gap-2'>
				<AlertCircle className='w-14 h-14' />{' '}
				<h2 className='text-2xl font-bold text-muted-foreground'>
					Недопустимі дані
				</h2>
			</div>
		)
	}

	const data = await checkOneToOneConversation(
		+session.user.id,
		+params.chatId,
		0
	)
	if (!data) {
		return notFound()
	} else {
		return (
			<ChatOneToOneContent
				username={session.user.username}
				userId={+session.user.id}
				data={data}
			/>
		)
	}
}
