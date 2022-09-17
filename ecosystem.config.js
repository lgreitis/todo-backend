/**
 * @description pm2 configuration file.
 * @example
 *  production mode :: pm2 start ecosystem.config.js --only prod
 *  development mode :: pm2 start ecosystem.config.js --only dev
 */
export const apps = [
  {
    name: 'prod',
    script: 'dist/index.js',
    exec_mode: 'cluster',
    instance_var: 'INSTANCE_ID',
    instances: 4,
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_memory_restart: '1G',
    merge_logs: true,
    output: './logs/access.log',
    error: './logs/error.log',
    env: {
      PORT: 3000,
      NODE_ENV: 'production',
    },
  },
  {
    name: 'dev',
    script: './node_modules/.bin/ts-node',
    args: '-r tsconfig-paths/register --transpile-only src/index.ts',
    exec_mode: 'cluster',
    instance_var: 'INSTANCE_ID',
    instances: 4,
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_memory_restart: '1G',
    merge_logs: true,
    output: './logs/access.log',
    error: './logs/error.log',
    env: {
      PORT: 3000,
      NODE_ENV: 'development',
    },
  },
];
export const deploy = {
  production: {
    user: 'user',
    host: '0.0.0.0',
    ref: 'origin/master',
    repo: 'git@github.com:repo.git',
    path: 'dist/index.js',
    'post-deploy': 'yarn install && yarn build && pm2 reload ecosystem.config.js --only prod',
  },
};
