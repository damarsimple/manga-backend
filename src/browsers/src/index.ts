import Komicastid from "./komicastid";
import Komicast from "./komikcast";
import Manhwaindo from "./manhwaindo";
import Manhwaland from "./manhwaland";
import { Scrapper } from "./scrapper";

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
        console.error(error)
      }
    }


  }
}
