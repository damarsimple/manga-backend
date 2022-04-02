import { prisma } from "../../modules/Context";

import { exec } from "child_process";
import moment from "moment";
import { readdirSync, unlinkSync } from "fs";
import { parentPort } from "worker_threads";

const { PG_BACKUP_PATH, PG_PASSWORD, PG_USER, PG_DB, PG_HOST, PG_PORT } =
  process.env;

const main = async () => {
  if (!PG_BACKUP_PATH || !PG_PASSWORD || !PG_USER || !PG_DB) {
    console.log("env not defined");
    return;
  }

  await prisma.perfomanceAnalytic.deleteMany();

  const files = readdirSync(PG_BACKUP_PATH);

  if (files.length > 10) {
    files.forEach((e) => unlinkSync(`${PG_BACKUP_PATH}/${e}`));

    console.log("cleaning backup folder ...");
  }

  exec(
    `PGPASSWORD=${PG_PASSWORD} pg_dump -h ${PG_HOST} -p ${PG_PORT} -U ${PG_USER} ${PG_DB} > ${PG_BACKUP_PATH}/${moment().format(
      "YYYYMMDDmmss"
    )}.sql`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log(`backup database ${new Date().toISOString()}`);
    }
  );

  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
};

main();
