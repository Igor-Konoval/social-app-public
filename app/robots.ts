import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				disallow: ['/settings', '/notifications', '/messages', '/friends'],
			},
		],
		sitemap: process.env.NEXTAUTH_URL + '/sitemap.xml',
	}
}
