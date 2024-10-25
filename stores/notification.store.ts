import { create } from 'zustand'

type UnreadNotificationStore = {
	unreadNotifications: number
	incrementUnreadNotifications: () => void
	setUnreadNotifications: (count: number) => void
	clearUnreadNotifications: () => void
}

export const useUnreadNotificationStore = create<UnreadNotificationStore>(
	set => ({
		unreadNotifications: 0,
		incrementUnreadNotifications: () =>
			set(state => ({ unreadNotifications: state.unreadNotifications + 1 })),
		setUnreadNotifications: count => set({ unreadNotifications: count }),
		clearUnreadNotifications: () => set({ unreadNotifications: 0 }),
	})
)
