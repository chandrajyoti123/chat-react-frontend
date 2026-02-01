require('dotenv').config();

const API_URL = process.env.VITE_BACKEND_API_URL;

if (!API_URL) {
  throw new Error('VITE_BACKEND_API_URL is missing');
}

// normalize (avoid //api-json)
const BASE_URL = API_URL.endsWith('/')
  ? API_URL.slice(0, -1)
  : API_URL;

module.exports = {
  backendAPI: {
    input: `${BASE_URL}/api-json`,
    output: {
      target: './src/api/generated.ts',
      client: 'react-query',
      hooks: true,
      prettier: true,
      clean: true,
      override: {
        mutator: {
          path: './src/customFetch.ts',
          name: 'fetcher',
        },
      },
    },
  },
};
