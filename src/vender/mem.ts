import Memcached from 'memcached';
import config_F from './config';

const memc = config_F.memcached;
const MM = new Memcached(JSON.parse(memc.servers), {retries:0,retry:300,remove:true,maxExpiration:7200,poolSize:memc.poolsize,namespace:config_F.app.domain});

export default MM;