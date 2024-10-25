import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDate } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatRelativeDate(from: Date | string) {
	if (typeof from === 'string') from = new Date(from)

	const currentDate = new Date()
	if (currentDate.getFullYear() === from.getFullYear()) {
		return formatDate(from, 'MMM d, HH:mm')
	} else {
		return formatDate(from, 'MMM d, yyyy')
	}
}

export function formatNoStaticDate(from: Date | string) {
	if (typeof from === 'string') from = new Date(from)

	const currentDate = new Date()

	if (currentDate.getFullYear() === from.getFullYear()) {
		return format(from, 'MMM d, HH:mm')
	} else {
		return format(from, 'MMM d, yyyy')
	}
}

export const validateEmail = (email: string) => {
	const re = /^[^\s@]+@gmail\.com$/

	return re.test(email)
}
