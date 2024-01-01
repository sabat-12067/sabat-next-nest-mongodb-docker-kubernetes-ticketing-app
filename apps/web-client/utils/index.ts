import { envSchema } from '../env.mjs';

export const env = envSchema.parse(process.env);
