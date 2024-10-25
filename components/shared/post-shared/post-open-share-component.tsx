'use client'
import { useState } from 'react'
import { PostShareButton } from './post-share-button'
import { SendHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const PostOpenShareComponent: React.FC<{
	postId: number
	userId: number | undefined | null
	userStatus: 'authenticated' | 'loading' | 'unauthenticated'
	content: string
	imageUrl: string | null
	postUsername: string
	postUserAvatarUrl: string | undefined
}> = props => {
	const [open, setOpen] = useState(false)
	const router = useRouter()

	return (
		<span
			className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 [@media(max-width:400px)]:px-2 px-4 py-2 w-fit gap-2'
			onClick={e => {
				if (
					props.userId === null ||
					props.userId === undefined ||
					props.userStatus === 'unauthenticated'
				) {
					router.push(process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth')
					return false
				}
				if (props.userStatus === 'loading') {
					return false
				}
				if (!open && e.currentTarget.nodeName === 'SPAN') {
					setOpen(true)
					return false
				}
			}}
		>
			<SendHorizontal fill='white' />
			{open && (
				<PostShareButton
					{...props}
					open={open}
					setOpen={() => setOpen(false)}
					userId={1}
				/>
			)}
		</span>
	)
}
