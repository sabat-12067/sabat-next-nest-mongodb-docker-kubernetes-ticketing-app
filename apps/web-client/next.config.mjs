//@ts-check
import './env.validate.mjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { composePlugins, withNx } from '@nx/next';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  compiler: {
    // For other options, see https://styled-components.com/docs/tooling#babel-plugin
    styledComponents: true,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
