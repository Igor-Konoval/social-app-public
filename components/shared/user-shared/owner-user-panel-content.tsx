'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserPostGallery, UserSavedPostGallery } from '@/components/shared'
import { TypeUserByDisplayName } from '@/types/user-types'
import { Bookmark, Columns3 } from 'lucide-react'
import { useState } from 'react'
import { TypeSavedPosts } from '@/types/post.types'

export const OwnerUserPanelContent: React.FC<{
	posts: TypeUserByDisplayName['posts']
	savedPosts: TypeSavedPosts
}> = ({ posts, savedPosts }) => {
	const [tab, setActiveTab] = useState('posts')

	return (
		<Tabs
			onValueChange={setActiveTab}
			className='space-y-6'
			defaultValue='posts'
		>
			<TabsList className='grid h-[58px] w-full dark:bg-[#2d2c2c] bg-white/100 grid-cols-2'>
				<TabsTrigger
					className='px-0 py-1.5 hover:bg-slate-50 dark:hover:bg-[#3c3838] data-[state=active]:shadow-none dark:data-[state=active]:bg-[#4b4a4a]'
					value='posts'
				>
					<h1 className='text-xl font-bold space-y-2 w-fit'>
						<span className='flex flex-row items-center gap-1 text-gray-950 dark:text-white'>
							Posts <Columns3 className='w-6 h-6' />
						</span>
						{tab === 'posts' && (
							<div className='w-auth h-0.5 bg-gray-950 dark:bg-white'></div>
						)}
					</h1>
				</TabsTrigger>
				<TabsTrigger
					className='px-0 py-1.5 hover:bg-slate-50 dark:hover:bg-[#3c3838] data-[state=active]:shadow-none dark:data-[state=active]:bg-[#4b4a4a]'
					value='saved-posts'
				>
					<h1 className='text-xl font-bold space-y-2 w-fit'>
						<span className='flex flex-row items-center gap-1 text-gray-950 dark:text-white'>
							Saved posts <Bookmark className='w-6 h-6' />
						</span>
						{tab === 'saved-posts' && (
							<div className='w-auth h-0.5 bg-gray-950 dark:bg-white'></div>
						)}
					</h1>
				</TabsTrigger>
			</TabsList>
			<TabsContent value='posts'>
				<UserPostGallery posts={posts} />
			</TabsContent>
			<TabsContent value='saved-posts'>
				<UserSavedPostGallery posts={savedPosts} />
			</TabsContent>
		</Tabs>
	)
}
