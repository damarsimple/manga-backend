
import { Komikcast } from "./komikcast";
import axios from "axios";

async function main() {

  const declarations = [
    new Komikcast(),
  ];

  for (const x of declarations) {
    try {
      x.run();
      // x.axios.get("https://img.statically.io/img/kcast/komikcast.com/wp-content/uploads/2022/05/onm010522.png").catch((e) => console.log(`error ${e}`))

    } catch (error) {
      console.log('error')
    }
  }

}


main()