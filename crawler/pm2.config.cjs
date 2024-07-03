module.exports = {
   apps: [
       // {
       //     name: "---Crawler Dragark Activity Scout---",
       //     script: "./Scout.js",
       //     env_production: {
       //         NODE_ENV: "production",
       //     },
       //     env_development: {
       //         NODE_ENV: "development",
       //     },
       //     watch: true,
       //     log_date_format: "YYYY-MM-DD HH:mm Z",
       //     cron_restart: "*/2 * * * *",
       // },
       // {
       //     name: "---Crawler Dragark Activity Transport---",
       //     script: "./Transport.js",
       //     env_production: {
       //         NODE_ENV: "production",
       //     },
       //     env_development: {
       //         NODE_ENV: "development",
       //     },
       //     watch: true,
       //     log_date_format: "YYYY-MM-DD HH:mm Z",
       //     cron_restart: "*/2 * * * *",
       // },
       // {
       //     name: "---Crawler Dragark Activity Capture---",
       //     script: "./Capture.js",
       //     env_production: {
       //         NODE_ENV: "production",
       //     },
       //     env_development: {
       //         NODE_ENV: "development",
       //     },
       //     watch: true,
       //     log_date_format: "YYYY-MM-DD HH:mm Z",
       //     cron_restart: "*/2 * * * *",
       // },
       {
           name: "---Crawler Dragark Activity Point---",
           script: "src/app.js",
           env_production: {
               NODE_ENV: "production",
           },
           env_development: {
               NODE_ENV: "development",
           },
           watch: true,
           log_date_format: "YYYY-MM-DD HH:mm Z",
           cron_restart: "*/2 * * * *",
       },
   ],
};