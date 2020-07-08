module.exports = {
    apps : [
      {
      name: '',
      script: 'bin/www',
      max_memory_restart : "1024M",
      env: {
        NODE_ENV: 'development',
        CONFIG_NAME:''
      },
      env_production : {
        NODE_ENV: 'production',
        CONFIG_NAME:''
      },
      instances: 1,
      autorestart: true,
      restart_delay: 0,
    //   watch: ["src","app.js"],
    //   watch_delay: 500,
    //   ignore_watch : [],
    //   output:'./data/logs/out.log',
    //   error:'./data/logs/error.log',
      merge_logs:true
    }
  ],
    deploy: {
      // "production" is the environment name
      production: {
        // SSH key path, default to $HOME/.ssh
        key: "~/lr.pem",
        // SSH user
        user: "root",
        // SSH host
        host: [""],
        // SSH options with no command-line flag, see 'man ssh'
        // can be either a single string or an array of strings
        ssh_options: "StrictHostKeyChecking=no",
        // GIT remote/branch
        ref: "origin/master",
        // GIT remote
        repo: "git@gitlab.minfindata.com:wangbolin/NodeSerGames.git",
        // path in the server
        path: "/usr/",
        // Pre-setup command or path to a script on your local machine
        'pre-setup': " ",
        // Post-setup commands or path to a script on the host machine
        // eg: placing configurations in the shared dir etc
        'post-setup': "",
        // pre-deploy action
        'pre-deploy-local': "",
        // post-deploy action
        'post-deploy': "",
      },
    }
  };
  