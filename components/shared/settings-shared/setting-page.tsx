'use client'
import { ChangeEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TypeGetUserSettingsByUserIdWithoutNull } from '@/types/user-types'
import { fetchUpdateUserSettings } from '@/services/user.services'
import { signOut } from 'next-auth/react'
import { SkeletonImg } from '../skeleton-shared/skeleton-img'

export const SettingPage: React.FC<{
	user: TypeGetUserSettingsByUserIdWithoutNull
}> = ({ user }) => {
	const [isFetching, setIsFetching] = useState(false)
	const [email, setEmail] = useState(user.email)
	const [avatar, setAvatar] = useState<string | null>(user.avatarUrl)
	const [newAvatar, setNewAvatar] = useState<File | null>(null)
	const [username, setUsername] = useState(user.username)
	const [displayName, setDisplayName] = useState(user.displayName.slice(1))
	const [bio, setBio] = useState<string | null>(user.bio)
	const [isPassword, setIsPassword] = useState(user.password)
	const [createPassword, setCreatePassword] = useState('')
	const [repeatPassword, setRepeatPassword] = useState('')
	const [passwordError, setPasswordError] = useState(false)

	const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0]
			setNewAvatar(file)
			const reader = new FileReader()
			reader.onloadend = () => {
				setAvatar(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const checkPassword = () => {
		if (createPassword.length < 6 || createPassword !== repeatPassword) {
			setPasswordError(true)
		} else {
			setPasswordError(false)
		}
	}

	const sendUpdate = async (e: React.FormEvent) => {
		e.preventDefault()

		if (passwordError || isFetching) return

		const formData = new FormData()

		if (newAvatar) formData.append('avatar', newAvatar)
		if (username !== user.username) formData.append('username', username)
		if ('@' + displayName !== user.displayName)
			formData.append('displayName', displayName)
		if (bio !== user.bio && bio) formData.append('bio', bio)
		if (createPassword.length >= 6) formData.append('password', createPassword)

		if (Array.from(formData).length === 0) return

		setIsFetching(true)

		try {
			const response = await fetchUpdateUserSettings(formData)

			if (response) {
				await signOut()
			}
		} catch (error) {
			console.error('Error updating user settings')
		} finally {
			setIsFetching(false)
		}
	}

	return (
		<Card className='w-full dark:bg-[#212121] dark:border-[#6f6f6f] dark:text-white max-w-2xl mx-auto'>
			<CardHeader>
				<CardTitle>Редагувати профіль</CardTitle>
			</CardHeader>
			<CardContent>
				<form className='space-y-4' onSubmit={sendUpdate}>
					<div className='flex items-center space-x-4'>
						<Avatar className='w-24 h-24'>
							<AvatarImage
								src={
									avatar ||
									process.env.NEXT_PUBLIC_DEFAULT_URL + 'avatar-unknown.jpg'
								}
								alt='User avatar'
							/>
							<AvatarFallback>
								<SkeletonImg />
							</AvatarFallback>
						</Avatar>
						<Input
							type='file'
							className='dark:text-black dark:bg-[#c7c7c7] hover:cursor-pointer'
							onChange={handleAvatarChange}
							accept='image/*'
						/>
					</div>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700 dark:text-gray-400'
						>
							Пошта користувача
						</label>
						<Input id='email' value={email} disabled className='mt-1' />
					</div>
					<div>
						<label
							htmlFor='username'
							className='block text-sm font-medium text-gray-700 dark:text-gray-400'
						>
							Ім'я користувача
						</label>
						<Input
							id='username'
							value={username}
							onChange={e => setUsername(e.target.value)}
							className='mt-1'
						/>
					</div>
					<div>
						<label
							htmlFor='displayName'
							className='block text-sm font-medium text-gray-700 dark:text-gray-400'
						>
							Відображуване ім'я
						</label>
						<Input
							id='displayName'
							value={displayName}
							onChange={e => {
								if (e.target.value.includes('@')) return
								setDisplayName(e.target.value)
							}}
							className='mt-1'
						/>
					</div>
					{!isPassword && (
						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700 dark:text-gray-400'
							>
								Створити пароль, щоб додати вхід в систему через email +
								password
							</label>
							<Input
								id='password'
								type='password'
								value={createPassword}
								onChange={e => {
									setCreatePassword(e.target.value)
									checkPassword()
								}}
								className='mt-1'
							/>

							{createPassword.length > 0 && (
								<>
									<label
										htmlFor='repeat-password'
										className='block text-sm font-medium text-gray-700 dark:text-gray-400'
									>
										Повторіть пароль
									</label>
									<Input
										id='repeat-password'
										type='password'
										value={repeatPassword}
										onChange={e => {
											setRepeatPassword(e.target.value)
											checkPassword()
										}}
										className='mt-1'
									/>
									{passwordError && (
										<p className='text-red-500 text-sm'>
											Паролі не співпадають або менше 6 символів
										</p>
									)}
								</>
							)}
						</div>
					)}
					<div>
						<label
							htmlFor='bio'
							className='block text-sm font-medium text-gray-700 dark:text-gray-400'
						>
							Біографія
						</label>
						<Textarea
							id='bio'
							value={bio || ''}
							onChange={e => setBio(e.target.value)}
							className='mt-1'
							rows={4}
						/>
					</div>
					<Button type='submit' className='w-full' disabled={isFetching}>
						{isFetching ? 'Збереження...' : 'Зберегти зміни'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
