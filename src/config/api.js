
/**
 * Centralized Application API Configuration
 */

const resolveApiUrl = () => {
  let envUrl = '';

  // Read the Create React App environment variable
  if (typeof process !== 'undefined' && process.env) {
    envUrl =
      process.env.REACT_APP_API_URL ||
      process.env.REACT_APP_BACKEND_URL ||
      '';
  }

  envUrl = String(envUrl || '').trim();

  // Production fallback: AWS CloudFront backend
  if (!envUrl) {
    const isProduction =
      typeof process !== 'undefined' &&
      process.env &&
      process.env.NODE_ENV === 'production';

    if (isProduction) {
      envUrl = 'https://d1s1p22tr4dol2.cloudfront.net';
    } else {
      envUrl = 'http://localhost:5000';
    }
  }

  // Remove trailing slashes
  envUrl = envUrl.replace(/\/+$/, '');

  // Prevent duplicate /api paths
  if (envUrl.endsWith('/api')) {
    envUrl = envUrl.slice(0, -4).replace(/\/+$/, '');
  }

  return envUrl;
};

export const API_URL = resolveApiUrl();
export const API_BASE = `${API_URL}/api`;

/**
 * Safely parse JSON from a fetch Response.
 */
export const safeJson = async (
  response,
  defaultErrorMessage = 'Unexpected server response format.'
) => {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const statusText = response.statusText
      ? ` ${response.statusText}`
      : '';

    throw new Error(
      `API returned non-JSON response (${response.status}${statusText}). Please check backend connection at ${API_URL}.`
    );
  }

  try {
    return await response.json();
  } catch (err) {
    throw new Error(defaultErrorMessage);
  }
};
