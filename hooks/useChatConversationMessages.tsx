import { useInfiniteQuery } from '@tanstack/react-query'
import { TypeCheckOneToOneConversation } from '@/types/chat-types'
import { fetchConversationMessages } from '@/services/message.services'

export function useChatConversationMessages(
	queryKey: string[],
	conversationId: number
	// initialData: TypeCheckOneToOneConversation['messages']
) {
	return useInfiniteQuery({
		queryKey,
		queryFn: async ({ pageParam = 0 }) => {
			return await fetchConversationMessages(conversationId, pageParam)
		},
		// initialData: {
		// 	pages: [initialData],
		// 	pageParams: [0],
		// },
		initialPageParam: 0,

		getNextPageParam: (lastPage, pages) => {
			if (lastPage.length < 30) return undefined
			return pages.length * 30
		},

		refetchOnWindowFocus: false,
		staleTime: Infinity,
	})
}
