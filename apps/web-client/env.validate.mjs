// validateEnv.ts
import { generateErrorMessage } from 'zod-error';
import { getEnvIssues } from './env.mjs';

const issues = getEnvIssues();

if (issues) {
  console.error('Invalid environment variables, check the errors below!');
  console.error(
    generateErrorMessage(issues, {
      delimiter: { error: '\\n' },
    })
  );
  process.exit(-1);
}
