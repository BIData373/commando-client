import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const mesibaBaseApiUrl = import.meta.VITE_MESIBA_BASE_URL_API


export interface IMesibaIcon {
    id: number
    iconName: string
    heb_name: string
}

export function useSearchMesibaIcons(search: string) {
    return useQuery<IMesibaIcon[]>({
        queryKey: ['mesiba', search],
        queryFn: () =>
            search
                ? axios.request({
                    method: 'GET',
                    url: `${mesibaBaseApiUrl}${search}`
                })
                    .then(response => response.data)
                    .catch(err => {
                        throw err
                    })
                : []
    })
}