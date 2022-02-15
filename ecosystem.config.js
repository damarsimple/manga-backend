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
      exec_mode: "cluster",
      instances: "max",
    },
    {
      name: "cron",
      script: "yarn",
      args: "cron",
      exec_mode: "cluster",
      instances: "max",
    },
  ],
};
