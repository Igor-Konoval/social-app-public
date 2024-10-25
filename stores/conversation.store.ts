import { create } from 'zustand'

type ActiveConversationStore = {
	conversationId: number | null
	setConversationId: (conversationId: number) => void
	clearConversationId: () => void
}

export const useActiveConversationStore = create<ActiveConversationStore>(
	set => ({
		conversationId: null,
		setConversationId: conversationId => set({ conversationId }),
		clearConversationId: () => set({ conversationId: null }),
	})
)
