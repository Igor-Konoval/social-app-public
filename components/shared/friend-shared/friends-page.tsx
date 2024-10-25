'use client'
import type {
	TypeFriendList,
	TypeRequestFriendList,
} from '@/types/friend.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { FriendList } from './friend-list'
import { LucideMessageCircleQuestion, Users } from 'lucide-react'

export const FriendsPage: React.FC<{
	friendList: TypeFriendList
	requestFriendList: TypeRequestFriendList
}> = ({ friendList, requestFriendList }) => {
	const [tab, setActiveTab] = useState('friendList')

	return (
		<div className='min-h-screen border dark:border-[#6f6f6f]'>
			<Tabs
				onValueChange={setActiveTab}
				className='space-y-6 mt-3'
				defaultValue='friendList'
			>
				<TabsList className='grid w-full h-[58px] dark:bg-[#2d2c2c] bg-white/100 grid-cols-2'>
					<TabsTrigger
						className='px-0 py-1.5 hover:bg-slate-50 data-[state=active]:shadow-none dark:hover:bg-[#3c3838] dark:data-[state=active]:bg-[#4b4a4a]'
						value='friendList'
					>
						<h1 className='text-xl font-bold space-y-2 w-fit'>
							<span className='flex flex-row items-center gap-1 text-gray-950 dark:text-white'>
								Мої друзі <Users className='w-6 h-6' />
							</span>
							{tab === 'friendList' && (
								<div className='w-auth h-0.5 bg-gray-950 dark:bg-white' />
							)}
						</h1>
					</TabsTrigger>
					<TabsTrigger
						className='px-0 py-1.5 hover:bg-slate-50 data-[state=active]:shadow-none dark:hover:bg-[#3c3838] dark:data-[state=active]:bg-[#4b4a4a]'
						value='requestFriendList'
					>
						<h1 className='text-xl font-bold space-y-2 w-fit'>
							<span className='flex flex-row items-center gap-1 text-gray-950 dark:text-white'>
								Запити <LucideMessageCircleQuestion className='w-6 h-6' />
							</span>
							{tab === 'requestFriendList' && (
								<div className='w-auth h-0.5 bg-gray-950 dark:bg-white' />
							)}
						</h1>
					</TabsTrigger>
				</TabsList>
				<TabsContent
					hidden={'friendList' !== tab}
					forceMount={true}
					value='friendList'
				>
					<FriendList friendList={friendList} />
				</TabsContent>
				<TabsContent
					hidden={'requestFriendList' !== tab}
					forceMount={true}
					value='requestFriendList'
				>
					<FriendList requestFriendList={requestFriendList} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
