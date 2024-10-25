import { $Enums } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Title } from '../../ui/title'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'
import Link from 'next/link'

export const Social: React.FC<{
	popularUsers: {
		id: number
		username: string
		displayName: string
		avatarUrl: string | null
		status: $Enums.UserStatus
	}[]
}> = ({ popularUsers }) => {
	return (
		<div className='border border-black-200 rounded-lg h-fit'>
			<Title size='sm' className='py-2 px-4 font-semibold' text='Social' />
			<hr className='mb-2' />
			<ul className='space-y-1'>
				{popularUsers.map(user => (
					<li key={user.id}>
						<Link
							href={
								process.env.NEXT_PUBLIC_DEFAULT_URL +
								'user/' +
								user.displayName.slice(1)
							}
							className='flex items-center font-semibold gap-2 custom-row'
						>
							<Avatar>
								<AvatarImage
									src={
										user.avatarUrl
											? user.avatarUrl
											: process.env.NEXT_PUBLIC_DEFAULT_URL +
											  'avatar-unknown.jpg'
									}
									alt='avatar'
								/>
								<AvatarFallback>
									<SkeletonImg />
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col'>
								<p>
									{user.username.length > 13
										? user.username.slice(0, 13) + '...'
										: user.username}
								</p>
								<p className='text-xs text-gray-400'>
									{user.displayName.length > 13
										? user.displayName.slice(0, 13) + '...'
										: user.displayName}
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
