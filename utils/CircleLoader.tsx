import { LoaderCircle } from 'lucide-react'

export const CircleLoader: React.FC = () => {
	return (
		<div
			style={{ backgroundColor: 'rgb(229 229 229 / 50%)' }}
			className='absolute w-full h-full flex items-center justify-center'
		>
			<LoaderCircle className='w-12 h-12 z-[1000] animate-spin' />
		</div>
	)
}
