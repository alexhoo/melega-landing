export interface SiteUrlEnv {
  SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
}

/** Public base URL: explicit SITE_URL, else the Vercel production domain, else localhost. */
export function resolveSiteUrl(env: SiteUrlEnv): string {
  if (env.SITE_URL) return env.SITE_URL;
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:4321';
}
