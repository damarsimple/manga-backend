import axios from "axios";
import Komikcast from './komikcast';
import Manhwaindo from "./manhwaindo";
import Manhwaland from './manhwaland';

async function main() {
  const declarations = [
    new Komikcast({}),
    new Manhwaland({}),
    new Manhwaindo({})
  ];

  for (const x of declarations) {
    try {
      x.run();
      // x.axios.get("https://img.statically.io/img/kcast/komikcast.me/wp-content/uploads/2022/05/onm010522.png").catch((e) => console.log(`error ${e}`))
    } catch (error) {
      console.log("error");
    }
  }
}

main();