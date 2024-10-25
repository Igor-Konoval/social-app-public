'use client'
import Image from 'next/image'
import { SkeletonPostImg } from '../skeleton-shared/skeleton-post-img'
import { useState } from 'react'

export const PostImg: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	return (
		<div className='relative flex items-center justify-center w-[100%] h-auto md:max-h-[530px] lg:max-h-[650px] rounded-xl skeleton-wrapper'>
			{!isLoaded && <SkeletonPostImg className='absolute inset-0' />}{' '}
			<Image
				src={imageUrl}
				className={`max-w-[85%] h-auto md:max-h-[530px] lg:max-h-[650px] rounded-xl`}
				key={imageUrl}
				width={448}
				// loading='eager'
				height={650}
				alt='image'
				onLoad={() => {
					setIsLoaded(prev => !prev)
				}}
			/>
		</div>
	)
}
