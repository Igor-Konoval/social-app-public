import { Title } from '@/components/ui/title'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export const Guest: React.FC = () => {
	return (
		<div className='border border-black-200 rounded-lg h-fit'>
			{/* <Title size='sm' className='py-2 px-4 font-semibold' text='Account' />
			<hr /> */}
			<Link
				className='flex items-center p-2 w-full text-lg gap-2'
				href={process.env.NEXT_PUBLIC_DEFAULT_URL + 'auth'}
			>
				<LogIn /> Увійти
			</Link>
		</div>
	)
}
