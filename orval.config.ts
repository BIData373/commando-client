import { defineConfig } from 'orval';

export default defineConfig({
  vector: {
    output: {
      mode: 'tags-split',
      target: 'src/api/',
      schemas: 'src/api/model',
      client: 'react-query',
      mock: false
    },
    input: {
      target: 'http://localhost:3000/open-api/json',
    },
  },
});