import { fetchShareData } from '@/services/message.services'
import { useQuery } from '@tanstack/react-query'

export function usePostShare(userId: number, open: boolean = false) {
	const { data, isLoading } = useQuery({
		queryKey: ['shareToUsers', userId],
		queryFn: fetchShareData,
		enabled: open,
	})

	return { data, isLoading }
}
