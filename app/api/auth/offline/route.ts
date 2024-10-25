import { auth } from '@/auth'
import { changeToOfflineStatusUser } from '@/services/user.services'
import { NextResponse } from 'next/server'

export async function POST() {
	try {
		const session = await auth()
		if (session) {
			const data = await changeToOfflineStatusUser(+session.user.id)

			return NextResponse.json(data)
		} else {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
	} catch (error) {
		return NextResponse.json(
			{ error: 'Сталася помилка на сервері' },
			{ status: 500 }
		)
	}
}
