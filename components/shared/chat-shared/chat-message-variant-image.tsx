'use client'
import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const ChatMessageVariantImage: React.FC<{
	imageUrl: string | null
	content: string
}> = ({ imageUrl, content }) => {
	const [previewImage, setPreviewImage] = useState<string | null>(null)
	const [imageBase64, setImageBase64] = useState<string | null>(null)

	useEffect(() => {
		if (imageUrl) {
			fetch(imageUrl)
				.then(res => res.blob())
				.then(blob => {
					const reader = new FileReader()
					reader.onloadend = () => {
						setImageBase64(reader.result as string)
					}
					reader.readAsDataURL(blob)
				})
				.catch(() => {
					console.error('Помилка при завантаженні зображення')
				})
		}
	}, [imageUrl])

	const handleImageClick = () => {
		if (imageBase64) {
			setPreviewImage(imageBase64)
		}
	}

	const closePreview = () => {
		setPreviewImage(null)
	}

	return (
		<>
			{imageBase64 ? (
				<Image
					src={imageBase64}
					className='max-w-auto [@media(min-width:400px)]:max-w-[250px] h-auto rounded-lg cursor-pointer'
					key={imageBase64}
					width={300}
					height={300}
					alt={content}
					onClick={handleImageClick}
				/>
			) : (
				<SkeletonImg className='w-[250px] h-[350px] cursor-pointer' />
			)}
			{previewImage && (
				<div
					onClick={(e: React.MouseEvent<HTMLDivElement>) => {
						e.target === e.currentTarget && closePreview()
					}}
					className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
				>
					<div className='relative flex items-center justify-center h-[90vh]'>
						<button
							onClick={closePreview}
							className='absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2'
						>
							<X className='w-6 h-6' />
						</button>
						<Image
							src={previewImage}
							alt='Preview'
							className='max-w-full max-h-full object-contain'
							width={1350}
							height={1000}
						/>
					</div>
				</div>
			)}
		</>
	)
}
