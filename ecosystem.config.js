/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
/**
 * @description pm2 configuration file.
 * @example
 *  production mode :: pm2 start ecosystem.config.js --only prod
 *  development mode :: pm2 start ecosystem.config.js --only dev
 */
module.exports = {
  apps: [
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
  ],
  deploy: {
    production: {
      key: "/Users/lgreitis/todo",
      user: 'root',
      host: '134.209.86.90',
      ref: 'origin/main',
      repo: 'git@github.com:lgreitis/todo-backend.git',
      path: '/root/todo-backend',
      'post-deploy': 'yarn install && yarn build && pm2 reload ecosystem.config.js --only prod',
    },
  },
};
