import { z } from 'zod';

export const envSchema = z.object({
  FUSIONAUTH_ISSUER: z.string().min(2),
  FUSIONAUTH_CLIENT_ID: z.string().min(10),
  FUSIONAUTH_SECRET: z.string().min(10),
  FUSIONAUTH_TENANT_ID: z.string().min(10),
  FUSIONAUTH_URL: z.string().min(2),
  NEXTAUTH_SECRET: z.string().min(10),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export const getEnvIssues = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};
