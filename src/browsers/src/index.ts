import Komicastid from "./komicastid";
import Komicast from "./komikcast";
import Manhwaindo from "./manhwaindo";
import Manhwaland from "./manhwaland";
import { Scrapper } from "./scrapper";
import Logger from "../../modules/Logger";
import BunnyCDN from "../../modules/BunnyCDN";

main();

async function main() {
  console.log(`main called document state ${document.readyState}`);
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    const declarations: Scrapper[] = [
      new Manhwaindo(),
      new Manhwaland(),
      new Komicastid(),
      new Komicast(),
    ];

    for (const x of declarations) {
      try {
        x.run();
      } catch (error) {
        console.error(error);
      }
    }

    const chan = new BroadcastChannel("gudangkomik");

    interface PayloadData {
      command: string;
      payload: object;
    }

    const logger = new Logger();

    const bunny = new BunnyCDN();

    chan.onmessage = async ({ data }: { data: PayloadData }) => {
      console.log(`got command ${data.command} payload ${data.payload}`);

      const { path, url, file } = data.payload as {
        path: string;
        url: string;
        file: ArrayBuffer;
      };

      switch (data.command) {
        case "downloadAndUpload":
          await bunny.downloadAndUpload(url, path);
          break;
        case "upload":
          await bunny.upload(file as any, path);
          break;
      }

      chan.postMessage({
        command: "done",
        payload: {
          data: data.command,
        },
      });
    };
  }
}
