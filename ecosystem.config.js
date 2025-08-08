module.exports = {
  apps: [{
    name: 'naidizakupku-front',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/naidizakupku',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Прямой URL бэкенда (используется buildApiUrl)
      // Если ваш бэкенд слушает на другом хосте/порту, поменяйте здесь
      BACKEND_BASE_URL: 'http://localhost:9000/api'
    },
    error_file: '/var/log/naidizakupku/error.log',
    out_file: '/var/log/naidizakupku/out.log',
    log_file: '/var/log/naidizakupku/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G'
  }]
}