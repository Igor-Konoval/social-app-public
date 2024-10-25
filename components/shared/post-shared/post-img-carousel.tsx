import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { PostImg } from './post-img'

export const PostImgCarousel: React.FC<{ imageUrl: string[] }> = ({
	imageUrl,
}) => {
	return (
		<Carousel className='w-[90%] sm:w-[370px] md:w-[330px] lg:w-full max-w-md'>
			<CarouselContent>
				{imageUrl.map((url, index) => (
					<CarouselItem className='flex justify-center' key={index}>
						<PostImg key={index} imageUrl={url} />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className='dark:text-white [@media(max-width:580px)]:left-[-13px]' />
			<CarouselNext className='dark:text-white [@media(max-width:580px)]:right-[-13px]' />
		</Carousel>
	)
}
