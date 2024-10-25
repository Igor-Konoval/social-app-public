'use client'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GoogleButton } from '@/components/shared'
import { FormEventHandler, useState } from 'react'
import { signIn } from 'next-auth/react'
import { validateEmail } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

export const Auth = () => {
	const [errorValid, setErrorValid] = useState<string>('')
	const [isFetching, setIsFetching] = useState<boolean>(false)
	const router = useRouter()

	const login: FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()
		if (isFetching) return

		const formData = new FormData(event.currentTarget)

		const password = formData.get('password')
		const email = formData.get('email')

		if (typeof email === 'string' && typeof password === 'string') {
			if (password.length < 6) {
				setErrorValid(
					'ваш пароль має неприпустиму кількість символів, він має складатися від 6 символів'
				)
				return false
			}
			if (!validateEmail(email) || email.length === 0) {
				setErrorValid('вкажіть пошту в правильному форматі')
				return false
			}
		} else {
			setErrorValid('заповніть всі поля')
			return false
		}
		setIsFetching(true)

		try {
			const res = await signIn('credentials', {
				email,
				password,
				redirect: false,
			})
			if (res && res.error === null && res.code === null) {
				router.back()
			} else {
				setErrorValid(res ? res.code! : '')
			}
		} catch (error: any) {
			setErrorValid(error.message)
		} finally {
			setIsFetching(false)
		}
	}

	const registration: FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()
		if (isFetching) return

		const formData = new FormData(event.currentTarget)

		const email = formData.get('email')
		const username = formData.get('username')
		const displayName = formData.get('displayName')
		const password = formData.get('password')
		const confirmPassword = formData.get('confirmPassword')

		if (
			typeof email === 'string' &&
			typeof password === 'string' &&
			typeof username === 'string' &&
			typeof displayName === 'string'
		) {
			if (username.length === 0 || username.length > 20) {
				setErrorValid(
					'ваш логін має неприпустиму кількість символів, він має складатися з 1-20 символів'
				)
				return false
			}

			const displayNameSchema = z
				.string()
				.min(1)
				.max(20)
				.regex(/^[a-zA-Z0-9_%]+$/, 'Invalid display name format')

			const parsedResult = displayNameSchema.safeParse(displayName)
			if (!parsedResult.success) {
				setErrorValid(
					'display name має складатися з 1-20 символів a-Z 0-9, і не може містити знак @'
				)
				return false
			}

			if (password.length < 6) {
				setErrorValid(
					'ваш пароль має неприпустиму кількість символів, він має складатися від 6 символів'
				)
				return false
			}
			if (!validateEmail(email) || email.length === 0) {
				setErrorValid('вкажіть пошту в правильному форматі')
				return false
			}
		} else {
			setErrorValid('заповніть всі поля')
			return false
		}

		if (password !== confirmPassword) {
			setErrorValid('паролі не співпадають')
			return false
		}

		setIsFetching(false)

		try {
			const res = await signIn('credentials', {
				email,
				password,
				username,
				displayName,
				redirect: false,
			})
			if (res && res.error === null && res.code === null) {
				setErrorValid('')
				router.back()
			} else {
				setErrorValid(res ? res.code! : '')
			}
		} catch (error: any) {
			setErrorValid(error.message)
		} finally {
			setIsFetching(false)
		}
	}

	return (
		<Tabs defaultValue='login' className='my-3 max-w-[400px]'>
			<TabsList className='grid w-full grid-cols-2 *:font-semibold *:text-[14px]'>
				<TabsTrigger value='login'>Login</TabsTrigger>
				<TabsTrigger value='registration'>Registration</TabsTrigger>
			</TabsList>
			<TabsContent className='mt-4' value='login'>
				<form onSubmit={login}>
					<Card>
						<CardHeader>
							<CardTitle>Login</CardTitle>
							<CardDescription className='flex flex-col'>
								Fill in the fields to log in. Click login when you're done.
								{errorValid && <p className='text-red-500'>{errorValid}</p>}
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div className='space-y-1'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									name='email'
									placeholder='example@gmail.com'
								/>
							</div>
							<div className='space-y-1'>
								<Label htmlFor='password'>Password</Label>
								<Input id='password' type='password' name='password' />
							</div>
						</CardContent>
						<CardFooter className='flex justify-between'>
							<GoogleButton />
							<Button disabled={isFetching} type='submit'>
								{isFetching ? 'Login...' : 'Login'}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</TabsContent>
			<TabsContent className='mt-4' value='registration'>
				<form onSubmit={registration}>
					<Card>
						<CardHeader>
							<CardTitle>Registration</CardTitle>
							<CardDescription className='flex flex-col'>
								Create your account here. Click registration when you're done.
								{errorValid && <p className='text-red-500'>{errorValid}</p>}
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div className='space-y-1'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									name='email'
									placeholder='example@gmail.com'
									type='email'
								/>
							</div>
							<div className='space-y-1'>
								<Label htmlFor='username'>Username</Label>
								<Input id='username' placeholder='John Doe' name='username' />
							</div>
							<div className='space-y-1'>
								<Label htmlFor='displayName'>Display name</Label>
								<Input
									id='displayName'
									placeholder='@Jo_Do'
									name='displayName'
								/>
							</div>
							<div className='space-y-1'>
								<Label htmlFor='password'>Password</Label>
								<Input id='password' type='password' name='password' />
							</div>
							<div className='space-y-1'>
								<Label htmlFor='confirmPassword'>Confirm Password</Label>
								<Input
									id='confirmPassword'
									name='confirmPassword'
									type='password'
								/>
							</div>
						</CardContent>
						<CardFooter className='flex align-middle justify-between'>
							<GoogleButton />
							<Button disabled={isFetching} type='submit'>
								{' '}
								{isFetching ? 'Creating account...' : 'Create account'}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</TabsContent>
		</Tabs>
	)
}
