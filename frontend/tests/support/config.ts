type Config = {
  baseURL: string;
  timeout: {
    default: number;
    navigation: number;
  };
};

const config: Config = {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  timeout: {
    default: 30000,
    navigation: 60000,
  },
};

export default config;
