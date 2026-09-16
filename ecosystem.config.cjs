// pm2-конфиг прода (сервер). Запуск: `pm2 start ecosystem.config.cjs && pm2 save` из корня репо.
// tsx — devDependency в server/, поэтому на сервере `npm install` без --omit=dev; глобальный tsx не нужен.
module.exports = {
  apps: [{
    name: 'bestpracticeai',
    script: 'index.ts',
    cwd: '/var/www/bestpracticeai/server',
    interpreter: 'node',
    interpreter_args: '--import tsx/esm',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOST: '127.0.0.1'
    },
    restart_delay: 3000,
    max_restarts: 10
  }]
}
