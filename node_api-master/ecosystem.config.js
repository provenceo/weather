module.exports = {
  apps : [{
    name: 'API',
    env: {
      PM2_SERVE_PORT: 9999,   //静态服务器访问端口
      NODE_ENV: 'development' //启动默认模式
    },
    env_production : {
      NODE_ENV: 'production'  //使用production模式 pm2 start ecosystem.config.js --env production
    },
    watch:true,               //监听模式
    script: './bin/www',
    ignore_watch: ['node_modules', 'build', 'logs'],
    out_file: './logs/out.log', // 日志输出
    error_file: './logs/error.log', // 错误日志
    max_memory_restart: 2, // 超过多大内存自动重启，仅防止内存泄露，根据自己的业务设置
    exec_mode: 'cluster', // 开启多线程模式，用于负载均衡
    instances: 'max', // 启用多少个实例，可用于负载均衡
    autorestart: true, // 程序崩溃后自动重启
    merge_logs: true,         //集群情况下，可以合并日志
    log_type:"json",          //日志类型
    log_date_format: "YYYY-MM-DD HH:mm:ss",  //日志日期记录格式
  }],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
