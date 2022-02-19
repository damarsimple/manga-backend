import { PrismaClient } from '@prisma/client';


console.log(`cron started ${(new Date).toISOString()}`);


import Graceful from "@ladjs/graceful"
import Bree from "bree";

const { INIT_CWD } = process.env;

Bree.extend(require('@breejs/ts-worker'));

const bree = new Bree({
    root: `${INIT_CWD}/src/scripts/jobs`,
    defaultExtension: process.env.TS_NODE ? 'ts' : 'js',
    jobs: [

        {
            name: 'sitemap',
            interval: 'every 10 seconds',

        },
        {
            name: 'reset-view-week',
            interval: 'every 10 seconds',

        },

    ]
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();
