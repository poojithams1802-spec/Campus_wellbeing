/**
 * Centralized Application API Configuration
 */

const resolveApiUrl = () => {
  let envUrl = '';

  if (typeof process !== 'undefined' && process.env) {
    envUrl =
      process.env.REACT_APP_API_URL ||
      process.env.REACT_APP_BACKEND_URL ||
      '';
  }

  // AWS CloudFront backend fallback
  if (!envUrl) {
    envUrl = 'https://d1s1p22tr4dol2.cloudfront.net';
  }

  return String(envUrl)
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/api$/, '');
};

export const API_URL = resolveApiUrl();
export const API_BASE = `${API_URL}/api`;

console.log('Resolved API_URL:', API_URL);
console.log('Resolved API_BASE:', API_BASE);

/**
 * Safely parse JSON responses.
 */
export const safeJson = async (
  response,
  defaultErrorMessage = 'Unexpected server response format.'
) => {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error(
      `API returned non-JSON response (${response.status}).`
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error(defaultErrorMessage);
  }
};