import { config } from 'dotenv'
import { defineConfig } from 'orval';

config()

const API_URL = process.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  vector: {
    output: {
      mode: 'tags-split',
      target: 'src/api/',
      client: 'react-query',
      mock: true,
      httpClient: 'axios',
      schemas: {
        path: 'src/api/model',
        type: 'typescript'
      },
      override: {
        mutator: {
          path: 'src/axios.ts',
          name: 'apiRequest'
        }
      }
    },
    input: {
      target: `${API_URL}/open-api/json`,
    }
  }
});