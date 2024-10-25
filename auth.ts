import NextAuth, { Account, CredentialsSignin, Profile, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma/prisma-client'
import { Session } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
import { JWT } from 'next-auth/jwt'
import { hashSync, compareSync } from 'bcryptjs'

declare module 'next-auth' {
	interface User {
		username?: string
		displayName?: string
		password?: string
		avatarUrl: string | null | undefined
	}
}

class CustomCredentialsSignin extends CredentialsSignin {
	constructor(message: string) {
		super(message)
		this.code = message
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		Credentials({
			credentials: {
				email: { label: 'email', type: 'email', required: true },
				username: { label: 'username', type: 'username', required: true },
				displayName: {
					label: 'displayName',
					type: 'displayName',
					required: true,
				},

				password: { label: 'password', type: 'password', required: true },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null
				}

				return credentials as User
			},
		}),
	],
	trustHost: true,
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async signIn({
			user,
			profile,
			account,
		}: {
			user: User
			profile?: Profile
			account: Account | null
		}) {
			if (!user.email) throw new CustomCredentialsSignin('Email is required')
			if (!account) throw new CustomCredentialsSignin('Account is required')

			const existingUser = await prisma.user.findUnique({
				where: { email: user.email },
			})

			if (account.provider === 'credentials') {
				if (!existingUser) {
					if (user.displayName || user.username) {
						//registration user
						const nickId = Math.random().toString(36).substring(2, 10)
						const hashPassword = await hashSync(user.password as string, 8)

						const res = await prisma.user.create({
							data: {
								email: user.email,
								username: user.username || 'user' + nickId,
								displayName: user.displayName
									? '@' + user.displayName.split(' ').join('_')
									: '@user_' + nickId,
								password: hashPassword,
							},
						})
						user.displayName = res.displayName
						user.username = res.username
						user.avatarUrl = res.avatarUrl
						user.id = res.id.toString()

						return true
					}

					throw new CustomCredentialsSignin('Користувача не знайдено')
				}
				if (existingUser.providerId === null && existingUser.password) {
					if (!user.password)
						throw new CustomCredentialsSignin('Неправильна форма авторизації') // если гугл id нет и самого пароля не существует - такого аккаунта не должно быть
					//пользователь делает вход с помощью креденшл не имея гугл id
					const isValid = await compareSync(
						user.password,
						existingUser.password
					)

					if (!isValid)
						throw new CustomCredentialsSignin(
							'Неправильно введені дані авторизації'
						)
					if (isValid) {
						user.displayName = existingUser.displayName
						user.avatarUrl = existingUser.avatarUrl
						user.username = existingUser.username
						user.id = existingUser.id.toString()
						return true // Пользователь успешно вошел, добавить данные в токен
					}
					throw new CustomCredentialsSignin(
						'Неправильно введені дані авторизації'
					) //не существует пользователя с таким паролем или почтой, и он не имеет гугл id чтобы войти через него, так как выбрал провайдер креденшлс
				} else if (existingUser.providerId !== null && existingUser.password) {
					//мультилогин
					//если у пользователя в бд есть гугл id и пароль - значит он авторизовывался через гугл и создавал пароль через креденшлс - мультилогин - позволяем зайти через пароль
					if (!user.password)
						throw new CustomCredentialsSignin('Неправильная форма авторизации') //если гугл id есть, но самого пароля не существует - значит он еще не привязал пароль к аккаунту, он должен поменять провайдер на гугл авторизацию чтобы войти в свой аккаунт

					const isValid = await compareSync(
						user.password,
						existingUser.password
					)

					if (!isValid)
						throw new CustomCredentialsSignin(
							'Неправильно введені дані авторизації'
						)
					if (isValid) {
						user.displayName = existingUser.displayName
						user.avatarUrl = existingUser.avatarUrl
						user.username = existingUser.username
						user.id = existingUser.id.toString()

						return true // Пользователь успешно вошел, добавить данные в токен
					}
					throw new CustomCredentialsSignin(
						'Неправильно введені дані авторизації'
					)
				} else if (
					existingUser.providerId !== null &&
					existingUser.password === null
				) {
					//пользователь имеет аккаунт в бд с гугл id, но не создан с паролем - значит аккаунт не поддерживает мультилогин, нужно выбрать другой способ авторизации и в настройках профиля указать пароль для мультилогина
					throw new CustomCredentialsSignin(
						'Недійсна авторизація. Спробуйте ще раз, або змініть спосіб авторизації'
					)
				}
			}
			if (account.provider === 'google') {
				// Проверка, существует ли пользователь с таким email
				if (!profile)
					throw new CustomCredentialsSignin('Користувача не знайдено')

				if (existingUser) {
					if (existingUser.providerId === account.providerAccountId) {
						user.displayName = existingUser.displayName
						user.avatarUrl = existingUser.avatarUrl
						user.username = existingUser.username
						user.id = existingUser.id.toString()

						return true //делаем сессию и токеном
					} else {
						await prisma.user.update({
							where: { id: existingUser.id },
							data: { providerId: account.providerAccountId },
						})
						user.displayName = existingUser.displayName
						user.avatarUrl = existingUser.avatarUrl
						user.username = existingUser.username
						user.id = existingUser.id.toString()

						return true //изменяем на мультилогин и делаем сессию и токеном
					}
				} else {
					const nickId = Math.random().toString(36).substring(2, 10)
					const res = await prisma.user.create({
						data: {
							email: user.email,
							username: profile.name || 'User' + nickId,
							displayName: profile.name?.includes('@')
								? '@user_' + nickId
								: profile.name
								? '@' +
								  profile.name[0].toLowerCase() +
								  profile.name.slice(1).split(' ').join('_')
								: '@user_' + nickId,
							avatarUrl: profile.picture,
							providerId: account.providerAccountId,
						},
					})

					user.displayName = res.displayName
					user.avatarUrl = res.avatarUrl
					user.username = res.username
					user.id = res.id.toString()

					return true //делаем сессию и токеном, но аккаунт без пароля, пароль можно будет в настройках изменить
				}
			}
			return false
		},

		async jwt({ token, user }: { token: JWT; user: User | AdapterUser }) {
			if (user) {
				token.id = user.id as string
				token.displayName = user.displayName as string
				token.avatarUrl = user.avatarUrl ? user.avatarUrl : user.image
				token.username = user.username as string
				delete token['email']
				delete token['name']
				delete token['picture']
			}

			return token
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			session.user = {
				id: token.id,
				username: token.username,
				displayName: token.displayName,
				avatarUrl: token.avatarUrl,
			} as Session['user']

			return session
		},
	},
})
