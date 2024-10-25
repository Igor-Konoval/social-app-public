import type { TypePostCard } from '@/types/post.types'
import { useQuery } from '@tanstack/react-query'

export function usePosts(
	func: () => Promise<TypePostCard[]>,
	queryKey: string[],
	initialData?: TypePostCard[]
) {
	const { data, error, isLoading, refetch } = useQuery({
		queryKey,
		queryFn: func,
		initialData: () => initialData || [],
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	})

	return { data, error, isLoading, refetch }
}
