'use client'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import {
	fetchAcceptFriendRequest2,
	fetchRejectFriendRequest,
	fetchRejectFriendRequest2,
	fetchSendFriendRequests,
} from '@/services/friend.services'
import { $Enums } from '@prisma/client'
import {
	Ban,
	Check,
	Loader2,
	MoreVertical,
	UserMinus,
	UserRoundCheck,
	UserRoundMinusIcon,
	X,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export const FriendButton: React.FC<{
	updateRequestFriendList?: (arg: any, method: 'add' | 'remove') => void
	updateFriendList?: (friendId: number, method: 'remove') => void
	friendId: number
	rejectFriendId?: number
	status: $Enums.FriendStatus
}> = ({
	status,
	friendId,
	rejectFriendId,
	updateRequestFriendList,
	updateFriendList,
}) => {
	const [isFetching, setIsFetching] = useState(false)
	const [isFetchingAccept, setIsFetchingAccept] = useState(false)
	const [isFetchingReject, setIsFetchingReject] = useState(false)

	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isAlertOpen, setIsAlertOpen] = useState(false)
	const [isAlertOpen2, setIsAlertOpen2] = useState(false)
	const [isAlertOpen3, setIsAlertOpen3] = useState(false)

	const { data } = useSession()

	const handleAlertOpen = (open: boolean) => {
		setIsAlertOpen(open)
		if (open) setIsDropdownOpen(true)
	}

	const handleDropdownOpen = (open: boolean) => {
		setIsDropdownOpen(open)
		if (!open) setIsAlertOpen(false)
		if (!open) setIsAlertOpen2(false)
		if (!open) setIsAlertOpen3(false)
	}

	const handleAlertOpen2 = (open: boolean) => {
		setIsAlertOpen2(open)
		if (open) setIsDropdownOpen(true)
	}

	const handleAlertOpen3 = (open: boolean) => {
		setIsAlertOpen3(open)
		if (open) setIsDropdownOpen(true)
	}

	return (
		<>
			<DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpen}>
				<DropdownMenuTrigger asChild className='[@media(max-width:500px)]:px-1'>
					<Button className='rounded-2xl dark:bg-[#bababa]' variant='outline'>
						<MoreVertical className='w-6 h-6' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56 bg-white'>
					<DropdownMenuGroup>
						{data && +data?.user.id !== friendId ? (
							<DropdownMenuItem onSelect={e => e.preventDefault()}>
								<AlertDialog open={isAlertOpen} onOpenChange={handleAlertOpen}>
									<AlertDialogTrigger asChild>
										<div className='gap-2 w-full font-semibold flex flex-row items-center'>
											<UserMinus className='w-6 h-6' />
											{isFetching ? (
												<Loader2 className='w-6 h-6 animate-spin' />
											) : status === 'ACCEPTED' ? (
												'Видалити з друзів'
											) : (
												'Скасувати запит'
											)}
										</div>
									</AlertDialogTrigger>
									<AlertDialogContent className='bg-white dark:bg-[#292929]'>
										<AlertDialogHeader>
											<AlertDialogTitle className='dark:text-white'>
												Ви впевнені що хочете
												{status === 'ACCEPTED'
													? ' видалити користувача з друзів?'
													: ' cкасувати запит на дружбу?'}
											</AlertDialogTitle>
											<AlertDialogDescription className='dark:text-white'>
												{status === 'ACCEPTED'
													? 'Користувач більше не буде вашим другом'
													: 'Користувач не зможе підтвердити запит на дружбу'}
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Закрити</AlertDialogCancel>
											<AlertDialogAction
												onClick={async () => {
													if (status === 'ACCEPTED') {
														if (isFetching) return
														setIsFetching(true)
														const data = await fetchRejectFriendRequest2(
															friendId
														) //удалить друга из своего списка друзей
														if (data) {
															updateFriendList &&
																updateFriendList(friendId, 'remove')
														}
														toast({
															title: 'Запит на видалення з друзів',
															duration: 3500,
															description: (
																<span className='flex flex-row items-center gap-1'>
																	<X className='w-6 h-6' /> Користувач більше не
																	ваш друг
																</span>
															),
														})
														setIsFetching(false)
													} else if (status === 'PENDING') {
														if (isFetching) return
														setIsFetching(true)
														const data = await fetchSendFriendRequests(friendId)
														if (data) {
															//отменяем заявку на дружбу обратно
															updateFriendList &&
																updateFriendList(friendId, 'remove')
														}
														toast({
															title: 'Скасування дружби',
															duration: 3500,
															description: (
																<span className='flex flex-row items-center gap-1'>
																	<X className='w-6 h-6' /> {data.message}
																</span>
															),
															variant:
																data.status === 'PENDING' ||
																data.status === 'REJECTED'
																	? 'default'
																	: 'destructive',
														})
														setIsFetching(false)
													}
												}}
											>
												Підтвердити
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</DropdownMenuItem>
						) : (
							<>
								<DropdownMenuItem onSelect={e => e.preventDefault()}>
									<div
										onClick={async () => {
											if (rejectFriendId) {
												if (isFetching) return
												setIsFetching(true)
												setIsFetchingAccept(true)
												const data = await fetchAcceptFriendRequest2(
													rejectFriendId
												) //вернет массив с другом которого подтвердили или undefined
												if (data && updateRequestFriendList) {
													updateRequestFriendList(data, 'add') //добавить друга в список друзей
												}
												toast({
													title: 'Запит на підтвердження дружби',
													duration: 3500,
													description: (
														<span className='flex flex-row items-center gap-1'>
															<Check className='w-6 h-6' /> Дружба підтверджена
														</span>
													),
												})
												setIsFetching(false)
												setIsFetchingAccept(false)
											}
										}}
										className='gap-2 w-full font-semibold flex flex-row items-center'
									>
										<UserRoundCheck className='w-6 h-6' />
										{isFetchingAccept ? (
											<Loader2 className='w-6 h-6 animate-spin' />
										) : (
											'Прийняти запит'
										)}
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem onSelect={e => e.preventDefault()}>
									<AlertDialog
										open={isAlertOpen2}
										onOpenChange={handleAlertOpen2}
									>
										<AlertDialogTrigger asChild>
											<div className='gap-2 w-full font-semibold flex flex-row items-center'>
												<UserRoundMinusIcon className='w-6 h-6' />
												{isFetchingReject ? (
													<Loader2 className='w-6 h-6 animate-spin' />
												) : (
													'Відхилити запит'
												)}
											</div>
										</AlertDialogTrigger>
										<AlertDialogContent className='bg-white dark:bg-[#292929]'>
											<AlertDialogHeader>
												<AlertDialogTitle className='dark:text-white'>
													Ви впевнені що хочете відхилити запит?
												</AlertDialogTitle>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Закрити</AlertDialogCancel>
												<AlertDialogAction
													onClick={async () => {
														if (rejectFriendId) {
															if (isFetching) return
															setIsFetching(true)
															setIsFetchingReject(true)
															const data = await fetchRejectFriendRequest(
																rejectFriendId
															)
															if (data && updateRequestFriendList) {
																updateRequestFriendList(data, 'remove')
															}
															toast({
																title: 'Запит на відхилення дружби',
																duration: 3500,
																description: (
																	<span className='flex flex-row items-center gap-1'>
																		<Check className='w-6 h-6' /> Дружба
																		відхилена
																	</span>
																),
															})
															setIsFetching(false)
															setIsFetchingReject(false)
														}
													}}
												>
													Підтвердити
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</DropdownMenuItem>
							</>
						)}
						<DropdownMenuItem onSelect={e => e.preventDefault()}>
							<AlertDialog open={isAlertOpen3} onOpenChange={handleAlertOpen3}>
								<AlertDialogTrigger asChild>
									<div className='gap-2 w-full font-semibold flex flex-row items-center'>
										<Ban className='w-6 h-6' /> Заблокувати
									</div>
								</AlertDialogTrigger>
								<AlertDialogContent className='bg-white dark:bg-[#292929]'>
									<AlertDialogHeader>
										<AlertDialogTitle className='dark:text-white'>
											Ви впевнені що хочете заблокувати користувача?
										</AlertDialogTitle>
										<AlertDialogDescription className='dark:text-white'>
											Користувач більше не вам написати повідомлення
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Закрити</AlertDialogCancel>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
