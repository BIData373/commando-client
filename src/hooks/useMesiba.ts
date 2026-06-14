import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { MESIBA_BASE_API_URL, USE_MOCK_API } from "../utils/env-utils"

export interface IMesibaIcon {
	id: number
	iconName: string
	heb_name: string
}

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

const mockIcon = "/logo512.png"

const mockMesibaIcons: IMesibaIcon[] = [
	{ id: 1, iconName: mockIcon, heb_name: "פיקוד צפון" },
	{ id: 2, iconName: mockIcon, heb_name: "פיקוד מרכז" },
	{ id: 3, iconName: mockIcon, heb_name: "פיקוד דרום" },
	{ id: 4, iconName: mockIcon, heb_name: "פיקוד העורף" },
	{ id: 5, iconName: mockIcon, heb_name: "מטכ״ל" },
	{ id: 6, iconName: mockIcon, heb_name: "חיל האוויר" },
	{ id: 7, iconName: mockIcon, heb_name: "חיל הים" },
	{ id: 8, iconName: mockIcon, heb_name: "חיל השריון" },
	{ id: 9, iconName: mockIcon, heb_name: "חיל הרגלים" },
	{ id: 10, iconName: mockIcon, heb_name: "חיל ההנדסה" },
	{ id: 11, iconName: mockIcon, heb_name: "חיל הקשר" },
	{ id: 12, iconName: mockIcon, heb_name: "חיל המודיעין" },
]

const mesibaMockActive =
	USE_MOCK_API || !MESIBA_BASE_API_URL || MESIBA_BASE_API_URL.length === 0

const mockMesibaApi = {
	async search(query: string): Promise<IMesibaIcon[]> {
		await delay()
		if (!query.trim()) return []
		return mockMesibaIcons.filter((icon) => icon.heb_name.includes(query))
	},
	async getByIconName(iconName: string): Promise<IMesibaIcon | null> {
		await delay()
		return mockMesibaIcons.find((icon) => icon.iconName === iconName) ?? null
	},
}

export function useSearchMesibaIcons(search: string) {
	return useQuery<IMesibaIcon[]>({
		queryKey: ["mesiba", search],
		queryFn: () =>
			mesibaMockActive
				? mockMesibaApi.search(search)
				: search
					? axios
							.get<IMesibaIcon[]>(new URL(search, MESIBA_BASE_API_URL).href)
							.then((r) => r.data)
					: Promise.resolve([]),
	})
}

export function useMesibaIconByName(iconName?: string) {
	return useQuery<IMesibaIcon | null>({
		queryKey: ["mesiba-by-name", iconName],
		queryFn: () =>
			mesibaMockActive
				? mockMesibaApi.getByIconName(iconName as string)
				: axios
						.get<IMesibaIcon>(
							new URL(`by-name/${iconName}`, MESIBA_BASE_API_URL).href,
						)
						.then((r) => r.data),
		enabled: !!iconName,
	})
}
