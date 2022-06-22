import BunnyCDN from "../modules/BunnyCDN";
import HttpsProxyAgent from "https-proxy-agent";
import axios from "axios";

// const httpsAgent = HttpsProxyAgent({ host: "localhost", port: "8191" });

const bunny = new BunnyCDN({
  // downloadResponseType: "blob",
  log: true,
  //@ts-ignoresassassss
  axiosDefault: {
    // httpsAgent,
  },
});

const d = axios.create({
  // httpsAgent,

  headers: {
    "User-Agent" : "Mozilla/5.0 (X11; Linux x86_64; rv:101.0) Gecko/20100101 Firefox/101.0"
  }
});

async function name() {
  console.log("nice");

  const g =   {
      "cmd": "request.get",
      "url":"https://cdn.komikcast.com/wp-content/img/L/Leviathan/200/01.jpg",
      "maxTimeout": 60000
  }
  
  await d.post("http://localhost:8191/v1", g)
  .then((e) => console.log(e.data))

  console.log("nice");
}

name().then(() => console.log("finished"));
