'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { ImagePlus, Send, X } from 'lucide-react'
import { PostImgCarousel } from './post-img-carousel'
import { PostImg } from './post-img'
import { CircleLoader } from '@/utils/CircleLoader'
import { fetchCreatePost } from '@/services/post.services'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const CreatePost: React.FC<{ refetch: () => void }> = ({ refetch }) => {
	const [postText, setPostText] = useState('')
	const [images, setImages] = useState<string[]>([])
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const { status } = useSession()
	const router = useRouter()

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files).map(file =>
				URL.createObjectURL(file)
			)
			setImages(prevImages => [...prevImages, ...newImages])

			const files = Array.from(e.target.files)
			setImageFiles(prevImages => [...prevImages, ...files])
		}
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const droppedFile = e.dataTransfer.files[0]
			if (droppedFile.type.startsWith('image/')) {
				const newImage = URL.createObjectURL(droppedFile)

				setImages(prevImages => [...prevImages, newImage])
				setImageFiles(prevImages => [...prevImages, droppedFile])
			}
			e.dataTransfer.clearData()
		}
	}

	const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
		if (e.clipboardData.files && e.clipboardData.files.length > 0) {
			const pastedFile = e.clipboardData.files[0]
			if (pastedFile.type.startsWith('image/')) {
				const newImage = URL.createObjectURL(pastedFile)

				setImages(prevImages => [...prevImages, newImage])
				setImageFiles(prevImages => [...prevImages, pastedFile])
			}
		}
	}

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPostText(e.target.value)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (status === 'unauthenticated') {
			router.push(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
			return false
		}
		if (status === 'loading') return false
		if (isLoading || (postText.length === 0 && imageFiles.length === 0))
			return false
		setIsLoading(true)

		const formData = new FormData()
		formData.append('content', postText)

		imageFiles.forEach(image => {
			formData.append('images', image)
		})

		const result = await fetchCreatePost(formData)

		if (result) {
			setPostText('')
			setImages([])
			setImageFiles([])
			refetch()
			setIsLoading(false)
		} else {
			setIsLoading(false)
		}
	}

	return (
		<Card className='w-[90%] sm:w-[500px] dark:bg-[#212121] dark:border-[#878787] dark:text-white md:w-[450px] lg:w-[600px] relative pb-3 mx-auto'>
			{isLoading ? <CircleLoader /> : null}
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div
					onDrop={handleDrop}
					onDragOver={e => e.preventDefault()}
					className='p-6 space-y-3'
				>
					<CardTitle className='text-xl'>Створити свій пост:</CardTitle>
					<Textarea
						placeholder='Що у Вас нового?'
						value={postText}
						onChange={handleTextChange}
						onPaste={handlePaste}
						className='min-h-[100px]'
					/>

					<div className='flex items-center justify-between space-x-2'>
						<div className='gap-2 flex'>
							<Button
								type='button'
								variant='outline'
								className='[@media(max-width:400px)]:px-2'
								onClick={() => {
									if (status === 'unauthenticated') {
										router.push(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
										return false
									}
									if (status === 'loading') return false
									document.getElementById('image-upload')?.click()
								}}
							>
								<ImagePlus className='[@media(min-width:400px)]:mr-1 h-4 w-4' />
								<span className='block [@media(max-width:480px)]:hidden [@media(max-width:400px)]:px-2'>
									Зображення
								</span>
							</Button>
							<input
								id='image-upload'
								type='file'
								accept='image/*'
								multiple
								onChange={handleImageUpload}
								className='hidden'
							/>
							{images.length > 0 ? (
								<Button
									variant='destructive'
									type='button'
									className='[@media(max-width:400px)]:px-2'
									onClick={() => {
										setImages([])
										setImageFiles([])
									}}
								>
									<X className='[@media(min-width:400px)]:mr-1 h-4 w-4' />
									<span className='block [@media(max-width:480px)]:hidden'>
										Видалити
									</span>
								</Button>
							) : null}
						</div>
						<Button
							onClick={e => {
								if (isLoading) {
									e.preventDefault()
									return false
								}
							}}
							className='dark:bg-[#6d6d6d]'
							type='submit'
						>
							<Send className='mr-2 h-4 w-4' />
							Створити
						</Button>
					</div>
				</div>

				{postText || images.length > 0 ? (
					<>
						<div className='my-4 mt-6 px-6 flex flex-row justify-between'>
							<CardTitle className=' text-xl'>Вигляд поста:</CardTitle>
						</div>

						<CardContent className='text-xl'>
							{postText && <p className='py-6 pt-0 rounded'>{postText}</p>}

							{images.length > 0 && (
								<div className='mt-4 flex justify-center'>
									{images.length === 1 ? (
										<PostImg imageUrl={images[0]} />
									) : (
										<PostImgCarousel imageUrl={images} />
									)}
								</div>
							)}
						</CardContent>
					</>
				) : null}
			</form>
		</Card>
	)
}
