'use client'
import { type TypeUserByDisplayName } from '@/types/user-types'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const UserPostGallery: React.FC<{
	posts: TypeUserByDisplayName['posts']
}> = ({ posts }) => {
	return (
		<>
			{posts && posts.length ? (
				<div className='grid grid-cols-3 [@media(max-width:530px)]:grid-cols-2 min-h-32 sm:grid-cols-3 md:sm:grid-cols-3 gap-4'>
					{posts.map(post => (
						<Link
							href={`/post/${post.id}`}
							key={post.id}
							className='w-full h-[140px] [@media(min-width:390px)]:h-[172px] relative group flex justify-center align-middle border border-slate-400/20 rounded-lg cursor-pointer'
						>
							{post.imageUrl[0] ? (
								<Image
									width={172}
									height={172}
									quality={30}
									src={post.imageUrl[0]}
									alt={`Post ${post.id}`}
									className='w-auto h-auto max-h-[140px] [@media(min-width:390px)]:max-h-[172px] rounded-lg'
								/>
							) : (
								<div className='flex flex-row align-center p-3 text-sm font-semibold text-black/65 overflow-hidden'>
									<p className='break-words line-clamp-3 overflow-hidden'>
										{post.content}
									</p>
								</div>
							)}
							<div className='absolute flex flex-col items-center inset-0 bg-black bg-opacity-50 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg'>
								<span className='mr-3 flex flex-row items-center gap-1 text-white text-sm'>
									<Heart className='w-4 h-4' /> {post._count.reactions}
								</span>
								<div className='flex flex-row align-center p-3 text-sm font-semibold text-white overflow-hidden'>
									<p className='break-words line-clamp-3 overflow-hidden'>
										{post.content}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className='flex flex-col items-center justify-center min-h-32'>
					<p className='text-gray-500 font-semibold text-xl'>Немає постів</p>
				</div>
			)}
		</>
	)
}
