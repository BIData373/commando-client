import type {
	QueryKey,
	UseMutationOptions,
	UseQueryOptions,
} from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"

export type QueryOptions<TData> = Omit<
	UseQueryOptions<TData>,
	"queryKey" | "queryFn"
>
export type MutationOptions<TVariables = void, TData = unknown> = Omit<
	UseMutationOptions<TData, Error, TVariables>,
	"mutationFn"
>

export const invalidateQueries = (keys: QueryKey[]) => {
	keys.forEach((key) => {
		queryClient.invalidateQueries({ queryKey: key })
	})
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
	},
})
