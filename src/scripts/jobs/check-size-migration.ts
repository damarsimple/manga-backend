import { QueueGetters } from "bullmq";

async function main() {
    const count = await new QueueGetters("chapter migration").count()

    console.log(`count ${count}`);

}

main();