import { getAllPostIds } from '@/services/post.services'
import { getUsers } from '@/services/user.services'
import { MetadataRoute } from 'next'

async function generateSiteMapUsers(): Promise<MetadataRoute.Sitemap> {
	const getAllUsers = await getUsers()

	const usersPaths = getAllUsers.map(user => ({
		url:
			process.env.NEXT_PUBLIC_DEFAULT_URL + 'user/' + user.displayName.slice(1),
		lastModified: new Date(),
	}))

	return usersPaths
}

async function generateSiteMapPosts(): Promise<MetadataRoute.Sitemap> {
	const getAllPosts = await getAllPostIds()

	const postsPaths = getAllPosts.map(post => ({
		url: process.env.NEXT_PUBLIC_DEFAULT_URL + 'post/' + post.id,
		lastModified: new Date(),
	}))

	return postsPaths
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		{
			url: process.env.NEXT_PUBLIC_DEFAULT_URL!,
			lastModified: new Date(),
		},
		...(await generateSiteMapUsers()),
		...(await generateSiteMapPosts()),
	]
}
