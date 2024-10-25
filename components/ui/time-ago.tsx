import { formatNoStaticDate } from '@/lib/utils'

export function timeAgo(from: Date | string): string {
	const date = from instanceof Date ? from : new Date(from)
	const differenceInMinutes = Math.floor(
		(Date.now() - date.getTime()) / (60 * 1000)
	)

	let formattedTime = ''

	if (differenceInMinutes < 1) {
		formattedTime = '1 хв. тому'
	} else if (differenceInMinutes < 5) {
		formattedTime = 'декілька хв. тому'
	} else if (differenceInMinutes < 60) {
		formattedTime = `${Math.floor(differenceInMinutes / 5) * 5} хв. тому`
	} else if (differenceInMinutes < 120) {
		formattedTime = '1 год. тому'
	} else if (differenceInMinutes < 180) {
		formattedTime = '2 год. тому'
	} else if (differenceInMinutes < 240) {
		formattedTime = '3 год. тому'
	} else if (differenceInMinutes < 300) {
		formattedTime = '4 год. тому'
	} else {
		formattedTime = formatNoStaticDate(date)
	}
	return formattedTime
}
