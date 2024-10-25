import { useInfiniteQuery } from '@tanstack/react-query'
import { getFriendListPosts } from '@/services/post.services'

export function useInfiniteFriendPosts(queryKey: string[], limit: number) {
	return useInfiniteQuery({
		queryKey,
		queryFn: async ({ pageParam = 0 }) => {
			return getFriendListPosts(pageParam)
		},
		initialPageParam: 0,

		getNextPageParam: (lastPage, pages) => {
			if (lastPage.length < limit) return undefined
			return pages.length * limit
		},

		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	})
}
