'use client'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchPostShare } from '@/services/post.services'
import { SkeletonShareItem } from '../skeleton-shared/skeleton-share-item'
import { PostShareItemConversation } from './post-share-item-conversation'
import { PostShareItemFriends } from './post-share-item-friends'
import { usePostShare } from '@/hooks/usePostShare'

export const PostShareButton: React.FC<{
	open: boolean
	setOpen: () => void
	postId: number
	userId: number
	content: string
	imageUrl: string | null
	postUsername: string
	postUserAvatarUrl: string | undefined
}> = ({
	userId,
	open,
	setOpen,
	postId,
	content,
	imageUrl,
	postUsername,
	postUserAvatarUrl,
}) => {
	const [selectedUsers, setSelectedUsers] = useState<number[]>([])
	const [selectedConversations, setSelectedConversations] = useState<number[]>(
		[]
	)
	const { data, isLoading } = usePostShare(userId, open)

	async function handleClickShareButton() {
		if (userId) {
			await fetchPostShare(
				postId,
				userId,
				content,
				selectedConversations,
				selectedUsers,
				imageUrl,
				postUsername,
				postUserAvatarUrl
			)
		}
		setOpen()
	}
	return (
		<Drawer open={open} onClose={setOpen}>
			<DrawerContent className='flex flex-col justify-center items-center bg-white h-[65%]'>
				<DrawerHeader className='w-[600px]'>
					<DrawerTitle className='mt-2'>Кому відправити</DrawerTitle>
					<DrawerDescription>
						Поділіться постом з користувачами
					</DrawerDescription>
				</DrawerHeader>
				<ScrollArea type='always'>
					<div className='max-w-[600px] grid overflow-y-auto grid-cols-3 sm:grid-cols-4 px-2 mr-[2px] sm:px-4 gap-2 sm:gap-4 mt-4'>
						{isLoading &&
							new Array(4).fill(0).map((_, i) => <SkeletonShareItem key={i} />)}
						{!isLoading && !!data ? (
							<>
								<PostShareItemFriends
									friends={data.friends}
									selectedUsers={selectedUsers}
									setSelectedUsers={setSelectedUsers}
								/>
								{data.conversations !== null &&
								data.conversations.length > 0 ? (
									<PostShareItemConversation
										conversations={data.conversations}
										selectedConversations={selectedConversations}
										setSelectedConversations={setSelectedConversations}
										userId={userId}
									/>
								) : null}
							</>
						) : null}
					</div>
					{data?.conversations.length === 0 &&
					data?.friends?.friendOf.length === 0 &&
					data.friends.friends.length === 0 ? (
						<div className='text-center font-semibold text-muted-foreground text-lg'>
							<p>Додайте друзів щоб поділитися постом</p>
						</div>
					) : null}
				</ScrollArea>

				<DrawerFooter className='w-[300px]'>
					<Button
						variant='secondary'
						disabled={
							selectedUsers.length === 0 && selectedConversations.length === 0
						}
						onClick={handleClickShareButton}
					>
						Відправити
					</Button>
					<DrawerClose>
						<Button
							onClick={() => {
								setSelectedUsers([])
								setSelectedConversations([])
							}}
						>
							Cancel
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
