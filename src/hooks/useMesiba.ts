import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { mesibaApi } from "../mocks/endpoints";
import { USE_MOCK_API } from "../utils/envUtils";

const mesibaBaseApiUrl = import.meta.env.VITE_MESIBA_BASE_URL_API;

export interface IMesibaIcon {
	id: number;
	iconName: string;
	heb_name: string;
}

export function useSearchMesibaIcons(search: string) {
	return useQuery<IMesibaIcon[]>({
		queryKey: ["mesiba", search],
		queryFn: () =>
			USE_MOCK_API
				? mesibaApi.search(search)
				: search
					? axios
							.get<IMesibaIcon[]>(`${mesibaBaseApiUrl}${search}`)
							.then((r) => r.data)
					: Promise.resolve([]),
	});
}

export function useMesibaIconByName(iconName?: string) {
	return useQuery<IMesibaIcon | null>({
		queryKey: ["mesiba-by-name", iconName],
		queryFn: () =>
			USE_MOCK_API
				? mesibaApi.getByIconName(iconName as string)
				: axios
						.get<IMesibaIcon>(`${mesibaBaseApiUrl}by-name/${iconName}`)
						.then((r) => r.data),
		enabled: !!iconName,
	});
}
