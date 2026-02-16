module.exports = {
  apps: [
    {
      name: 'mission-control-api',
      script: 'app/server.js',
      cwd: '/Users/ruby/.openclaw/workspace/projects/mission-control',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5175
      },
      error_file: '/Users/ruby/.openclaw/workspace/logs/mission-control-api-error.log',
      out_file: '/Users/ruby/.openclaw/workspace/logs/mission-control-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'mission-control-ui',
      script: 'pnpm',
      args: 'run dev',
      cwd: '/Users/ruby/.openclaw/workspace/projects/mission-control/app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 5174
      },
      error_file: '/Users/ruby/.openclaw/workspace/logs/mission-control-ui-error.log',
      out_file: '/Users/ruby/.openclaw/workspace/logs/mission-control-ui-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
