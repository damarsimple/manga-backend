module.exports = {
  apps: [
    {
      name: "graphql",
      script: "yarn",
      args: "dev",
      exec_mode: "cluster",
      instances: "max",
    },
    {
      name: "worker",
      script: "yarn",
      args: "worker",
    },
    {
      name: "cron",
      script: "yarn",
      args: "cron",
    },
  ],
};
