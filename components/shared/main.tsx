import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import type { TypePostCard } from '@/types/post.types'
import { FriendListPosts, MyListPosts } from '@/components/shared'
type Props = {
	posts: TypePostCard[]
	className?: string
	status?: 'authenticated' | 'unauthenticated'
}

export const Main: React.FC<Props> = ({ posts, status }) => {
	return (
		<Tabs defaultValue='recommendation'>
			<TabsList className='w-full mx-auto sm:w-[500px] dark:bg-[#2d2c2c] md:w-[450px] lg:w-[600px] grid grid-cols-2'>
				<TabsTrigger
					value='recommendation'
					className='dark:font-semibold dark:text-gray-400'
				>
					Рекомендації
				</TabsTrigger>
				<TabsTrigger
					disabled={status === 'unauthenticated'}
					className='dark:font-semibold dark:text-gray-400'
					value='for-you'
				>
					Для вас
				</TabsTrigger>
			</TabsList>
			<TabsContent value='recommendation'>
				<MyListPosts posts={posts} />
			</TabsContent>
			<TabsContent value='for-you'>
				<FriendListPosts />
			</TabsContent>
		</Tabs>
	)
}
