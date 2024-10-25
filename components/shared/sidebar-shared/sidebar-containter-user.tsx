import { auth } from '@/auth'
import { Guest, Sidebar } from '@/components/shared'

export const SidebarContainerUser: React.FC = async () => {
	const data = await auth()

	if (data === null) {
		return <Guest />
	}

	if (data.user) {
		return <Sidebar user={data.user} />
	}
}
