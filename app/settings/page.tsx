import { auth } from '@/auth'
import { SettingPage } from '@/components/shared'
import { getUserSettingsByUserId } from '@/services/user.services'
import { notFound, redirect } from 'next/navigation'

export default async function page() {
	const session = await auth()

	if (!session) {
		redirect(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
	}

	const user = await getUserSettingsByUserId(+session.user.id)

	if (!user) {
		return notFound()
	}

	return <SettingPage user={user} />
}
