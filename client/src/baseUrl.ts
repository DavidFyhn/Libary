const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // In development, your API is running on localhost
    return 'http://localhost:5067';
  }
  // In production, your API is at your Fly.io URL
  return 'https://libaryserver.fly.dev';
};

export const baseUrl = getBaseUrl();
