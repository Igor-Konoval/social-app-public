import {
	Container,
	Header,
	MobilePanel,
	SidebarContainer,
} from '@/components/shared'
import { QueryProvider } from '@/utils/ReactQueryProvider'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

export const metadata: Metadata = {
	title: {
		default: 'Lin-Social',
		template: '',
	},
	description: 'Соціальна мережа Lin-Social',
	openGraph: {
		title: 'Lin-Social',
		siteName: 'Lin-Social',
		locale: 'uk_UA',
		url: process.env.NEXT_PUBLIC_DEFAULT_URL,
		type: 'website',
	},
}
export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode
	modal: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} bg-white dark:bg-[#212121] ${geistMono.variable} antialiased`}
			>
				<Header className='hidden md:block h-[80px] mb-2' />
				<Container className='flex flex-nowrap content-start pt-0 mb-[50px] md:mb-0 md:pt-[80px] md:gap-4'>
					<SessionProvider>
						<QueryProvider>
							<SidebarContainer />
							<main className='ml-0 md:ml-5 md:max-w-[600px] flex flex-col  flex-1'>
								{modal}
								{children}
								<MobilePanel />
							</main>
							<Toaster />
						</QueryProvider>
					</SessionProvider>
				</Container>
			</body>
		</html>
	)
}
