import { create } from 'zustand'

type UnreadMessagesStore = {
	unreadMessages: number
	incrementUnreadMessages: () => void
	dicrementUnreadMessages: () => void
	setUnreadMessages: (count: number) => void
	clearUnreadMessages: () => void
}

export const useUnreadMessagesStore = create<UnreadMessagesStore>(set => ({
	unreadMessages: 0,
	incrementUnreadMessages: () =>
		set(state => ({ unreadMessages: state.unreadMessages + 1 })),

	dicrementUnreadMessages: () =>
		set(state => ({
			unreadMessages: state.unreadMessages > 0 ? state.unreadMessages - 1 : 0,
		})),
	setUnreadMessages: count => set({ unreadMessages: count }),
	clearUnreadMessages: () => set({ unreadMessages: 0 }),
}))
