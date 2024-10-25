import { useQuery } from '@tanstack/react-query'
import { TypeGetAllChats } from '@/types/chat-types'

export function useChat(userId: number, initialData: TypeGetAllChats) {
	return useQuery({
		queryKey: ['chats', userId],
		queryFn: () => fetch('/api/chats').then(res => res.json()),
		initialData,
		// refetchOnWindowFocus: 'always',
		// staleTime: 20000,
		// retryOnMount: true,
		// refetchOnMount: true,
		// refetchOnReconnect: 'always',
		// refetchInterval: 20000,
		refetchOnWindowFocus: true, // Обновление при возвращении фокуса на окно
		// refetchOnMount: 'always', // Обновление при каждом монтировании компонента
		// refetchOnReconnect: 'always', // Обновление при переподключении
		staleTime: 0, // Все данные считаются устаревшими сразу же
		retryOnMount: true,
		refetchInterval: 20000, // Интервал для автоматической ревалидации
	})
}
