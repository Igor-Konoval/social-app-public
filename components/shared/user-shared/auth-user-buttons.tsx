'use client'
import { Button } from '@/components/ui/button'
import * as AlertDialog from '@/components/ui/alert-dialog'
import {
	fetchAcceptFriendRequest,
	fetchRejectFriendRequest,
	fetchSendFriendRequests,
} from '@/services/friend.services'
import {
	Check,
	Loader2,
	UserCheck,
	UserMinus,
	UserPlus2,
	UserRoundX,
	X,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { $Enums } from '@prisma/client'
import { useState } from 'react'

export const AuthUserButtons: React.FC<{
	id: number
	makeFriend:
		| {
				status: $Enums.FriendStatus
				userId: number
		  }
		| undefined
	friendOf:
		| {
				status: $Enums.FriendStatus
				userId: number
		  }[]
		| undefined
}> = ({ id, makeFriend, friendOf }) => {
	const { toast } = useToast()
	const [localMakeFriend, setLocalMakeFriend] = useState(makeFriend)
	const [localFriendOf, setLocalFriendOf] = useState(friendOf)
	const [isFetching, setIsFetching] = useState(false)

	return (
		<>
			{localFriendOf &&
				!localFriendOf.length &&
				localMakeFriend &&
				localMakeFriend.status === 'PENDING' && (
					<>
						<AlertDialog.AlertDialog>
							<AlertDialog.AlertDialogTrigger asChild>
								<Button
									className='rounded-2xl [@media(max-width:350px)]:px-3 gap-2  font-semibold'
									variant='secondary'
								>
									<UserRoundX className='w-6 h-6' />
									{isFetching ? (
										<Loader2 className='w-6 h-6 animate-spin' />
									) : (
										<span className='hidden [@media(min-width:440px)]:block'>
											Відмінити
										</span>
									)}
								</Button>
							</AlertDialog.AlertDialogTrigger>
							<AlertDialog.AlertDialogContent className='bg-white'>
								<AlertDialog.AlertDialogHeader>
									<AlertDialog.AlertDialogTitle>
										Ви впевнені що хочете скасувати запит на дружбу?
									</AlertDialog.AlertDialogTitle>
									<AlertDialog.AlertDialogDescription>
										Користувач більше не побачить ваш запит на дружбу
									</AlertDialog.AlertDialogDescription>
								</AlertDialog.AlertDialogHeader>
								<AlertDialog.AlertDialogFooter>
									<AlertDialog.AlertDialogCancel>
										Закрити
									</AlertDialog.AlertDialogCancel>
									<AlertDialog.AlertDialogAction
										onClick={async () => {
											if (id) {
												if (isFetching) return
												setIsFetching(true)
												const data = await fetchSendFriendRequests(id)
												setLocalMakeFriend(undefined)
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
									</AlertDialog.AlertDialogAction>
								</AlertDialog.AlertDialogFooter>
							</AlertDialog.AlertDialogContent>
						</AlertDialog.AlertDialog>
					</>
				)}
			{localFriendOf && !localFriendOf.length && !localMakeFriend && (
				<>
					<Button
						className='rounded-2xl gap-2 font-semibold'
						variant='secondary'
						onClick={async () => {
							if (id) {
								if (isFetching) return
								setIsFetching(true)
								const data = await fetchSendFriendRequests(id)
								setLocalMakeFriend(data.makeFriend)
								toast({
									title: 'Запит на дружбу',
									duration: 3500,
									description: (
										<span className='flex flex-row items-center gap-1'>
											<Check className='w-6 h-6' /> {data.message}
										</span>
									),
									variant:
										data.status === 'PENDING' || data.status === 'REJECTED'
											? 'default'
											: 'destructive',
								})
								setIsFetching(false)
							}
						}}
					>
						<UserPlus2 className='w-6 h-6' />
						{isFetching ? (
							<Loader2 className='w-6 h-6 animate-spin' />
						) : (
							'Додати'
						)}
					</Button>
				</>
			)}
			{!localMakeFriend &&
				localFriendOf &&
				localFriendOf[0] &&
				localFriendOf[0].status === 'ACCEPTED' && (
					<AlertDialog.AlertDialog>
						<AlertDialog.AlertDialogTrigger asChild>
							<Button
								className='rounded-2xl gap-2 font-semibold'
								variant='secondary'
							>
								<UserMinus className='w-6 h-6' />
								{isFetching ? (
									<Loader2 className='w-6 h-6 animate-spin' />
								) : (
									'Видалити'
								)}
							</Button>
						</AlertDialog.AlertDialogTrigger>
						<AlertDialog.AlertDialogContent className='bg-slate-300'>
							<AlertDialog.AlertDialogHeader>
								<AlertDialog.AlertDialogTitle>
									Ви впевнені що хочете видалити користувача з друзів?
								</AlertDialog.AlertDialogTitle>
								<AlertDialog.AlertDialogDescription>
									Користувач більше не буде вашим другом
								</AlertDialog.AlertDialogDescription>
							</AlertDialog.AlertDialogHeader>
							<AlertDialog.AlertDialogFooter>
								<AlertDialog.AlertDialogCancel>
									Закрити
								</AlertDialog.AlertDialogCancel>
								<AlertDialog.AlertDialogAction
									onClick={async () => {
										if (isFetching) return
										setIsFetching(true)
										const data = await fetchRejectFriendRequest(id)
										if (data) setLocalFriendOf([])
										toast({
											title: 'Запит на видалення з друзів',
											duration: 3500,
											description: (
												<span className='flex flex-row items-center gap-1'>
													<X className='w-6 h-6' /> Користувач більше не ваш
													друг
												</span>
											),
										})
										setIsFetching(false)
									}}
								>
									Підтвердити
								</AlertDialog.AlertDialogAction>
							</AlertDialog.AlertDialogFooter>
						</AlertDialog.AlertDialogContent>
					</AlertDialog.AlertDialog>
				)}
			{localFriendOf &&
				localFriendOf[0] &&
				localFriendOf[0].status === 'PENDING' && (
					<Button
						className='rounded-2xl gap-2 font-semibold'
						variant='secondary'
						onClick={async () => {
							if (isFetching) return
							setIsFetching(true)
							const data = await fetchAcceptFriendRequest(id)
							setLocalFriendOf(data)
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
						}}
					>
						<UserCheck className='w-6 h-6' />
						{isFetching ? (
							<Loader2 className='w-6 h-6 animate-spin' />
						) : (
							'Прийняти'
						)}
					</Button>
				)}
		</>
	)
}
