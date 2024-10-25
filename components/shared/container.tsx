import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({
	children,
	className,
}) => {
	return (
		<div className={cn('container mx-auto max-w-[1000px]', className)}>
			{children}
		</div>
	)
}
