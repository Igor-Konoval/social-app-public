import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const ChatMessageVariantPost: React.FC<{
	postUsername: string | null
	postUserAvatarUrl: string | null
	postId: number | null
	content: string
	imageUrl: string | null
}> = ({ postUsername, postUserAvatarUrl, postId, content, imageUrl }) => {
	return (
		<Link href={`/post/${postId}`}>
			<Card className='w-[150px] [@media(min-width:370px)]:w-[200px] [@media(min-width:450px)]:w-[250px] overflow-hidden transition-colors duration-150 hover:cursor-pointer hover:bg-slate-100'>
				<CardHeader className='px-2 pt-3 pb-2 bg-black text-white'>
					<div className='flex items-center space-x-2'>
						<Avatar className='w-8 h-8'>
							<AvatarImage
								src={
									postUserAvatarUrl ||
									process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
								}
							/>
							<AvatarFallback>
								<SkeletonImg />
							</AvatarFallback>
						</Avatar>
						<CardTitle className='text-sm font-medium'>
							{postUsername}
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className='p-3 pt-2'>
					<p className='text-sm mb-3 line-clamp-3'>{content}</p>
					{imageUrl && (
						<div className='relative w-full h-[150px] [@media(min-width:370px)]:h-[200px] [@media(min-width:450px)]:h-[300px] mb-2'>
							<Image
								src={imageUrl}
								layout='fill'
								objectFit='cover'
								sizes='250px'
								className='rounded-md'
								alt='Post image'
							/>
						</div>
					)}
				</CardContent>
			</Card>
		</Link>
	)
}
