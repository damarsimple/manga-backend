

import Graceful from "@ladjs/graceful"
import Bree from "bree";



const bree = new Bree({
    root: `${__dirname}/jobs`,

    // defaultExtension: process.env.TS_NODE ? 'ts' : 'js',

    jobs: [

        {
            name: 'sitemap',
            interval: 'every 3 days',
        },
        {
            name: 'increment-view',
            interval: 'every 1 hours',
        },
        {
            name: 'reset-view-week',
            interval: 'every 1 weeks',
        }, {
            name: 'reset-view-daily',
            interval: 'every 1 days',
        },
        {
            name: 'reset-perfomance-report',
            interval: 'every 1 weeks',
        },
        {
            name: 'backup-postgress-db',
            interval: 'every 1 weeks',
        },

    ]
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });

graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();

console.log(`cron started ${(new Date).toISOString()}`);
