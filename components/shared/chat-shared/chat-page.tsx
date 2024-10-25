import { Title } from '@/components/ui/title'
import { TypeGetAllChats, TypeGetChatFriendList } from '@/types/chat-types'
import { Frown } from 'lucide-react'
import { ChatCreate } from './chat-create'
import { ChatCreateConversation } from './chat-create-conversation'
import { ChatList } from './chat-list'

export const ChatPage: React.FC<{
	userId: number
	initialData: TypeGetAllChats
	chatFriendList: TypeGetChatFriendList
}> = ({ userId, initialData, chatFriendList }) => {
	return (
		<div className='min-h-screen border'>
			<Title
				className='font-semibold my-4 text-center'
				text='Ваші чати'
				size='lg'
			/>
			<div className='flex flex-row gap-2 [@media(min-width:450px)]:gap-8 justify-center'>
				<ChatCreate chatFriendList={chatFriendList} />

				<ChatCreateConversation chatFriendList={chatFriendList} />
			</div>
			<div className='w-[90%] h-1 bg-gray-200 rounded-md my-6 mx-auto' />
			<div className='mt-4 space-y-2 flex flex-col justify-center'>
				<Title
					text='Повідомлення & чати:'
					className='px-6 mb-3 font-semibold'
					size='sm'
				/>
				{!!initialData.length ? (
					<ChatList initialData={initialData} userId={userId} />
				) : (
					<span className='flex flex-col justify-center items-center mt-[30%] font-semibold text-lg text-muted-foreground'>
						Поки що тут нічого немає <Frown className='mt-2 w-24 h-24' />
					</span>
				)}
			</div>
		</div>
	)
}
