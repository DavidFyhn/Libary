const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // In development, your API is running on localhost
    return 'http://localhost:5067'; // Make sure this port matches your API's launch port
  }
  // In production, your API is at your Fly.io URL
  return 'https://libary.fly.dev'; // Make sure this is your production URL
};

export const baseUrl = getBaseUrl();
