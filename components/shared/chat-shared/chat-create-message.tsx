'use client'
import {
	pushNoticeMessage,
	sendImageMessage,
	sendMessage,
} from '@/actions/chat.action'
import { Button } from '@/components/ui/button'
import { TypeCheckOneToOneConversation } from '@/types/chat-types'
import { ImagePlus, LoaderCircle, Plus, PlusIcon } from 'lucide-react'
import { useState } from 'react'

export const ChatCreateMessage: React.FC<{
	userId: number
	username: string
	data: TypeCheckOneToOneConversation
}> = ({ username, userId, data }) => {
	const [newMessage, setNewMessage] = useState('')
	const [isFetching, setIsFetching] = useState(false)
	const [isFetchingImg, setIsFetchingImg] = useState(false)

	async function handleSendMessage() {
		if (isFetching) return
		setIsFetching(true)
		sendMessage(userId, data.id, newMessage)
		setNewMessage('')

		const notificationPromises = data.users.map(user => {
			if (user.user.id !== userId) {
				return pushNoticeMessage(username, user.user.id, data.id)
			}
		})

		await Promise.all(notificationPromises)
		setIsFetching(false)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		if (isFetchingImg) return

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const droppedFile = e.dataTransfer.files[0]
			if (droppedFile.type.startsWith('image/')) {
				setIsFetchingImg(true)

				const reader = new FileReader()
				reader.onloadend = async () => {
					try {
						const base64String = reader.result as string
						await sendImageMessage(userId, data.id, base64String)
					} catch (error) {
						console.error('Помилка при завантаженні зображення')
					} finally {
						setIsFetchingImg(false)
					}
				}
				reader.readAsDataURL(droppedFile)
			}
			e.dataTransfer.clearData()
		}
	}
	async function handleImgUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (isFetching) return

		if (e.target.files) {
			setIsFetchingImg(true)

			const reader = new FileReader()
			reader.onloadend = async () => {
				try {
					const base64String = reader.result as string
					await sendImageMessage(userId, data.id, base64String)
				} catch (error) {
					console.error('Помилка при завантаженні зображення')
				} finally {
					setIsFetchingImg(false)
				}
			}
			reader.readAsDataURL(e.target.files[0])
		}
	}

	const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
		if (isFetchingImg) return

		if (e.clipboardData.files && e.clipboardData.files.length > 0) {
			const pastedFile = e.clipboardData.files[0]
			if (pastedFile.type.startsWith('image/')) {
				setIsFetchingImg(true)

				const reader = new FileReader()
				reader.onloadend = async () => {
					try {
						const base64String = reader.result as string
						await sendImageMessage(userId, data.id, base64String)
					} catch (error) {
						console.error('Помилка при завантаженні зображення')
					} finally {
						setIsFetchingImg(false)
					}
				}
				reader.readAsDataURL(pastedFile)
			}
		}
	}

	return (
		<div
			onDrop={handleDrop}
			onDragOver={e => e.preventDefault()}
			className='p-4 gap-2 border-t flex flex-row flex-nowrap items-center'
		>
			{isFetchingImg ? (
				<div className='w-fit h-fit flex justify-center items-center'>
					<LoaderCircle className='w-12 h-12 animate-spin' />
				</div>
			) : (
				<>
					<Button
						type='button'
						// variant='default'
						className='dark:bg-[#192358] [@media(max-width:400px)]:px-2 px-3'
						onClick={() => {
							document.getElementById('image-upload')?.click()
						}}
					>
						<ImagePlus className='h-4 w-4' />
						<PlusIcon className='h-4 w-4' />
					</Button>
					<input
						id='image-upload'
						type='file'
						accept='image/*'
						onChange={handleImgUpload}
						className='hidden'
					/>
				</>
			)}
			<input
				type='text'
				placeholder='Введите сообщение...'
				value={newMessage}
				onChange={e => setNewMessage(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter' && !e.shiftKey) {
						if (newMessage.length === 0) return
						handleSendMessage()
					}
				}}
				onPaste={handlePaste}
				className='w-full dark:text-black p-2 pl-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
			/>
			<Button
				onClick={() => handleSendMessage()}
				disabled={newMessage.length === 0}
				className='dark:bg-[#192358]'
			>
				{isFetching ? 'Отправка...' : 'Отправить'}
			</Button>
		</div>
	)
}
