
import { SocksProxyAgent } from 'socks-proxy-agent';


const agent = new SocksProxyAgent({
    hostname: "127.0.0.1",
    port: 1080,

});