#!/bin/bash
# Скрипт деплоя bestpracticeai.ru
# Запускать с сервера: bash /tmp/deploy.sh

set -e
echo "=== Шаг 1: Обновление системы ==="
apt update -y && apt upgrade -y

echo "=== Шаг 2: Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "=== Шаг 3: nginx, certbot, git ==="
apt install -y nginx certbot python3-certbot-nginx git

echo "=== Шаг 4: PM2 и TSX ==="
npm install -g pm2 tsx

echo "=== Шаг 5: Firewall ==="
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "=== Шаг 6: Клонирование репо ==="
mkdir -p /var/www/bestpracticeai
cd /var/www/bestpracticeai
git clone https://github.com/Isalin84/bestpracticeai-landing.git . 2>/dev/null || git pull

echo "=== Шаг 7: Зависимости сервера ==="
cd /var/www/bestpracticeai/server
npm install

echo "=== Шаг 8: nginx конфиг ==="
cat > /etc/nginx/sites-available/bestpracticeai << 'NGINX'
server {
    listen 80;
    server_name bestpracticeai.ru www.bestpracticeai.ru vm4297052.firstbyte.club;

    root /var/www/bestpracticeai/client/dist;
    index index.html;

    server_tokens off;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Cookie $http_cookie;
        proxy_read_timeout 30s;
    }

    location /health {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/bestpracticeai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl enable nginx && systemctl restart nginx

echo "=== Шаг 9: PM2 ecosystem ==="
cat > /var/www/bestpracticeai/ecosystem.config.cjs << 'PM2'
module.exports = {
  apps: [{
    name: 'bestpracticeai',
    script: 'tsx',
    args: 'index.ts',
    cwd: '/var/www/bestpracticeai/server',
    interpreter: 'node',
    interpreter_args: '--import tsx/esm',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    restart_delay: 3000,
    max_restarts: 10
  }]
}
PM2

echo "=== Шаг 10: Права на статику (фикс 403 на логотипы) ==="
# Файлы, залитые tar-ом с macOS, сохраняют права 700 (owner-only) —
# nginx (www-data) не может их прочитать и отдаёт 403 (грабли с логотипами).
# После КАЖДОЙ заливки client/dist прогонять нормализацию прав по ВСЕЙ папке:
if [ -d /var/www/bestpracticeai/client/dist ]; then
    chown -R root:root /var/www/bestpracticeai/client/dist
    chmod -R a+rX /var/www/bestpracticeai/client/dist
    echo "Права на client/dist нормализованы (a+rX)."
else
    echo "client/dist не найден — пропущено (залить фронт и прогнать шаг снова)."
fi

echo ""
echo "==================================================="
echo "ГОТОВО! Теперь нужно:"
echo "1. Загрузить .env и базу данных (см. инструкцию)"
echo "2. Запустить: pm2 start /var/www/bestpracticeai/ecosystem.config.cjs"
echo "3. pm2 save && pm2 startup"
echo "==================================================="
