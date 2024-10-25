/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: [
			'https://i.pinimg.com',
			'i.pinimg.com',
			'https://lh3.googleusercontent.com/a/',
			'res.cloudinary.com',
		],
	},
}

export default nextConfig
