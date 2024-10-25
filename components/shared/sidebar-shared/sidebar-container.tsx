import {
	SidebarContainerUser,
	SidebarRouterEvent,
	SkeletonSidebarSocial,
	Social,
} from '@/components/shared'
import { getPopularUsers } from '@/services/user.services'

export const SidebarContainer = async () => {
	const popularUsers = await getPopularUsers()

	return (
		<aside className='hidden [@media(max-width:1035px)]:ml-4 md:block w-[200px]'>
			<span className='space-y-14 [@media(max-height:1000px)]:space-y-5 w-[200px] fixed'>
				<SidebarContainerUser />
				{popularUsers ? (
					<Social popularUsers={popularUsers} />
				) : (
					<SkeletonSidebarSocial />
				)}
				<SidebarRouterEvent />
			</span>
		</aside>
	)
}
