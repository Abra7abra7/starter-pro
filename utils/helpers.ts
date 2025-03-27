/**
 * Converts a Unix timestamp to a Date object
 */
export const toDateTime = (secs: number): Date => {
  const t = new Date('1970-01-01T00:00:00Z');
  t.setSeconds(secs);
  return t;
};

/**
 * Calculates the Unix timestamp for when a trial period ends
 * @param trialDays - Number of trial days (optional)
 * @returns Unix timestamp of trial end date or undefined if no trial
 */
export const calculateTrialEndUnixTimestamp = (trialDays?: number | null): number | undefined => {
  if (!trialDays) return undefined;
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + trialDays);
  return Math.floor(trialEnd.getTime() / 1000);
};

/**
 * Generates a URL for redirecting users after an error
 * @param redirectPath - Base path to redirect to
 * @param error - Main error message
 * @param description - Detailed error description
 */
export const getErrorRedirect = (
  redirectPath: string,
  error: string,
  description: string
) => {
  const params = new URLSearchParams();
  params.append('error', error);
  params.append('error_description', description);
  return `${getURL(redirectPath)}?${params.toString()}`;
};

/**
 * Gets the base URL of the application or a full URL with path
 * Uses environment variable in production, falls back to localhost in development
 * @param path - Optional path to append to the base URL
 */
export const getURL = (path?: string) => {
  let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? 
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 
    'http://localhost:3000/';
  
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include trailing `/`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  
  // If path is provided, append it to the base URL
  if (path) {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return url + cleanPath;
  }
  
  return url;
};
