import { User } from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			username: string
			displayName: string
			token: string
			avatarUrl: string | null | undefined
		}
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string
		username: string
		displayName: string
		avatarUrl: string | null | undefined
	}
}
