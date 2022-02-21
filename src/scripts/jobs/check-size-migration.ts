import { QueueGetters } from "bullmq";
import { connection } from "../../modules/Redis";

async function main() {
    const count = await new QueueGetters("chapter migration", {
        connection
    }).count()

    console.log(`count ${count}`);

}

main();