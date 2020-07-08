import mongoose from 'mongoose';
import config_F  from './config';
const config = config_F.mongodb;
mongoose.connect(config.gamesdburl, {useNewUrlParser: true,keepAlive:true,poolSize:config.poolsize,dbName:config.gamesdbname});
const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
  // we're connected!
  // console.log('connected');
// });
export default db;