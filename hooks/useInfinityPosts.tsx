import { useInfiniteQuery } from '@tanstack/react-query'
import { getListPosts } from '@/services/post.services'
import { TypePostCard } from '@/types/post.types'

export function useInfinitePosts(
	queryKey: string[],
	limit: number,
	initialData: TypePostCard[]
) {
	return useInfiniteQuery({
		queryKey,
		queryFn: async ({ pageParam = 0 }) => {
			return getListPosts(pageParam)
		},
		initialData: {
			pages: [initialData],
			pageParams: [0],
		},
		initialPageParam: 20,

		getNextPageParam: (lastPage, pages) => {
			if (lastPage.length < limit) return undefined
			return pages.length * limit
		},

		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	})
}
