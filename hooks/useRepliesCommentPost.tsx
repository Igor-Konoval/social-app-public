import {
	fetchCreateReplyCommentPost,
	fetchGetRepliesCommentPost,
} from '@/services/post.services'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useRepliesCommentPost(
	parentCommentId: number,
	enabled = false
) {
	const queryClient = useQueryClient()
	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ['replies', parentCommentId],
		queryFn: () => fetchGetRepliesCommentPost(parentCommentId),
		enabled: enabled,
	})

	const mutation = useMutation({
		mutationFn: ({
			postId,
			content,
			parentCommentId,
			receiverId,
		}: {
			postId: number
			content: string
			parentCommentId: number
			receiverId: number
		}) =>
			fetchCreateReplyCommentPost(postId, content, parentCommentId, receiverId),
		onSuccess: newComment => {
			queryClient.setQueryData(['replies', parentCommentId], (oldData: any) => {
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
		replies: data,
		error,
		isLoading,
		refetch,
		createReplyComment: mutation.mutate,
	}
}
