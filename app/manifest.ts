import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		background_color: 'white',
		theme_color: '#ffffff',
		description: 'Соціальна мережа Lin-Social',
		name: 'Lin-Social',
		short_name: 'Lin-Social',
		start_url: '/',
		scope: process.env.NEXTAUTH_URL! || '/',
		lang: 'uk',
		dir: 'ltr',
		icons: [
			{
				src: '/48x48.png',
				sizes: '48x48',
				type: 'image/png',
			},
			{
				src: '/72x72.png',
				sizes: '72x72',
				type: 'image/png',
			},
			{
				src: '/96x96.png',
				sizes: '96x96',
				type: 'image/png',
			},
			{
				src: '/144x144.png',
				sizes: '144x144',
				type: 'image/png',
			},
			{
				src: '/168x168.png',
				sizes: '168x168',
				type: 'image/png',
			},
			{
				src: '/192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
		],
		display: 'standalone',
		categories: [''],
	}
}
