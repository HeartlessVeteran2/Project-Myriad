const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiConfig = {
  baseUrl: API_URL,
  endpoints: {
    auth: {
      login: `${API_URL}/api/auth/login`,
      register: `${API_URL}/api/auth/register`,
    },
    series: `${API_URL}/api/series`,
  }
};

export default apiConfig;
