module.exports = {
  apps: [
    {
      name: "graphql",
      script: "dist/src/server/graphql.js",
      exec_mode: "cluster",
      instances: "max",
    },
    {
      name: "worker",
      script: "yarn",
      args: "worker",
      exec_mode: "cluster",
      instances: "max",
    },
    {
      name: "cron",
      script: "dist/src/scripts/cron.js",
    },
  ],
};
