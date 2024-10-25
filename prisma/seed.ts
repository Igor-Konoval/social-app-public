import { hashSync } from 'bcryptjs'
import { prisma } from './prisma-client'

async function up() {
	await prisma.user.create({
		data: {
			username: 'Igor Konoval',
			displayName: '@igor_ko',
			email: 'igorkonoval02@gmail.com',
			providerId: null,
			password: hashSync('Akame-top', 8),
			posts: {
				create: [
					{
						content: `My wifes`,
						imageUrl: [
							'https://i.pinimg.com/564x/64/20/28/64202874f2a32e7412183d9a7f5d1035.jpg',
							'https://i.pinimg.com/564x/49/53/0e/49530e48a2bf907714b52f920c7a9e56.jpg',
							'https://i.pinimg.com/564x/e6/01/37/e60137e0dd4b78d13e8466a9be885ead.jpg',
							'https://i.pinimg.com/564x/a2/58/d7/a258d78f8a6659de52a77ffd68de1d42.jpg',
						],
					},
				],
			},
		},
	})
	await prisma.user.create({
		data: {
			username: 'John Doe',
			displayName: '@john_doe',
			email: 'john_doe@j.com',
			providerId: null,
			password: hashSync('123456', 8),
			posts: {
				create: [
					{
						content: `Kono Dio da! :D`,
						imageUrl: [
							'https://i.pinimg.com/564x/c5/67/72/c567724e9437ca904d7a415e5a6003fa.jpg',
						],
					},
				],
			},
		},
	})
	await prisma.user.create({
		data: {
			username: 'Jane Doe',
			displayName: '@jane_doe',
			email: 'jane_doe@j.com',
			providerId: null,
			password: hashSync('123456', 8),
			posts: {
				create: [
					{
						content: `Post from Jane Doe`,
					},
				],
			},
		},
	})
	await prisma.user.create({
		data: {
			username: 'Jim Doe',
			displayName: '@jim_doe',
			email: 'jim_doe@j.com',
			providerId: null,
			password: hashSync('123456', 8),
			posts: {
				create: [
					{
						content: `Post from Jim Doe`,
					},
				],
			},
		},
	})
	await prisma.user.create({
		data: {
			username: 'Jill Doe',
			displayName: '@jill_doe',
			email: 'jill_doe@j.com',
			providerId: null,
			password: hashSync('123456', 8),
			posts: {
				create: [
					{
						content: `Post from Jill Doe`,
					},
				],
			},
		},
	})
	await prisma.user.create({
		data: {
			username: 'Jack Doe',
			displayName: '@jack_doe',
			email: 'jack_doe@j.com',
			providerId: null,
			password: hashSync('123456', 8),
			posts: {
				create: [
					{
						content: `Post from Jack Doe`,
					},
				],
			},
		},
	})
	// await sendFriendRequest(46, 47)
	// await acceptFriendRequest(46, 47)
	// await sendFriendRequest(46, 48)
	// await acceptFriendRequest(46, 48)
	// await sendFriendRequest(47, 48)
	// await acceptFriendRequest(47, 48)
}
async function down() {
	await prisma.post.deleteMany()
	await prisma.friend.deleteMany()
	await prisma.user.deleteMany()
}
async function main() {
	try {
		await down()
		await up()
	} catch (error) {
		console.error(error)
	}
}

main()
	.then(async () => await prisma.$disconnect())
	.catch(async error => {
		console.error(error)
		await prisma.$disconnect()
		process.exit(1)
	})
