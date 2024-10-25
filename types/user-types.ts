import {
	getAuthUserByDisplayName,
	getUserByDisplayName,
	getUserSettingsByUserId,
} from '@/services/user.services'

export type TypeAwaitedUserByDisplayName = Awaited<
	ReturnType<typeof getUserByDisplayName>
>

export type TypeUserByDisplayName = Exclude<TypeAwaitedUserByDisplayName, false>

export type TypeAwaitedAuthUserByDisplayName = Awaited<
	ReturnType<typeof getAuthUserByDisplayName>
>

export type TypeAuthUserByDisplayName = Exclude<
	TypeAwaitedAuthUserByDisplayName,
	false
>

export type TypeGetUserSettingsByUserId = Awaited<
	ReturnType<typeof getUserSettingsByUserId>
>

export type TypeGetUserSettingsByUserIdWithoutNull = Exclude<
	TypeGetUserSettingsByUserId,
	null
>

export type TypeUserSettings = {
	avatar?: string | null
	avatarUrl?: string | null
	username?: string
	displayName?: string
	bio?: string | null
	password?: string | null
}
