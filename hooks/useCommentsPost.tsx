import {
	fetchGetCommentsPost,
	fetchCreateCommentsPost,
} from '@/services/post.services'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useCommentsPost(postId: number, enabled = false) {
	const queryClient = useQueryClient()
	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ['comments', postId],
		queryFn: () => fetchGetCommentsPost(postId),
		enabled: enabled,
	})

	const mutation = useMutation({
		mutationFn: ({ postId, content }: { postId: number; content: string }) =>
			fetchCreateCommentsPost(postId, content),
		onSuccess: newComment => {
			queryClient.setQueryData(['comments', postId], (oldData: any) => {
				if (!oldData) {
					return [newComment]
				} else {
					oldData.push(newComment)
				}
				return oldData
			})
		},
	})

	return {
		comments: data,
		error,
		isLoading,
		refetch,
		createComment: mutation.mutate,
	}
}
