import { QueueGetters } from "bullmq";
import { connection } from "../../modules/Redis";

async function main() {
    const cont = await new QueueGetters("chapter migration", {
        connection
    })

    setInterval(async () => {
        const count = await cont.count()
        console.log(`count ${count}`);
    }
        , 3000)
}

main();