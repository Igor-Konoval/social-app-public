'use client'

const Error = () => {
	return (
		<div className='flex dark:bg-[#212121] flex-col justify-center items-center min-h-[70vh]'>
			<p className='text-[26px] font-bold'>
				Oops! Сталася непередбачувана помилка.
			</p>
			<p className='text-xl mt-5'>
				Перезавантажте сторінку і спробуйте ще раз.
			</p>
		</div>
	)
}

export default Error
