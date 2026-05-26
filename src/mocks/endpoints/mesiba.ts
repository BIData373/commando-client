import type { IMesibaIcon } from "../../hooks/useMesiba";
import { mockMesibaIcons } from "../data/mesiba";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const mesibaApi = {
	async search(query: string): Promise<IMesibaIcon[]> {
		await delay();
		if (!query.trim()) return [];
		return mockMesibaIcons.filter((icon) => icon.heb_name.includes(query));
	},
	async getByIconName(iconName: string): Promise<IMesibaIcon | null> {
		await delay();
		return mockMesibaIcons.find((icon) => icon.iconName === iconName) ?? null;
	},
};
