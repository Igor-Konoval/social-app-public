'use client'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export const SidebarRouterEvent: React.FC = () => {
	const queryClient = useQueryClient()
	const pathname = usePathname()
	useEffect(() => {
		if (!pathname.includes('messages/')) {
			queryClient.removeQueries({
				predicate: query => query.queryKey.includes('conversation'),
			})
		}
	}, [pathname, queryClient])
	return <span />
}
