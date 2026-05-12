import { config } from 'dotenv'
import { Factory } from 'lucide-react';
import { defineConfig } from 'orval';

config()

const API_URL = process.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  vector: {
    output: {
      mode: 'tags-split',
      target: 'src/api/',
      client: 'react-query',
      mock: false,
      httpClient: 'axios',
      namingConvention: 'kebab-case',
      formatter: 'biome',
      clean: true,
      headers: true,
      schemas: {
        path: 'src/api/model',
        type: 'typescript'
      },
      override: {
        useDeprecatedOperations: false,
        useNamedParameters: true,
        preserveReadonlyRequestBodies: 'strip',
        mutator: {
          path: 'src/axios.ts',
          name: 'apiRequest'
        },
        query: {
          useQuery: true,
          useMutation: true,

          usePrefetch: false,
          useInvalidate: false,
          useSetQueryData: false,
          useGetQueryData: false,

          useInfinite: false,
          useSuspenseQuery: false,
          useSuspenseInfiniteQuery: false,

          shouldExportQueryKey: true,
          shouldSplitQueryKey: false,
          useOperationIdAsQueryKey: false,
        }
      },
    },
    input: {
      target: `${API_URL}/open-api/json`
    }
  }
});