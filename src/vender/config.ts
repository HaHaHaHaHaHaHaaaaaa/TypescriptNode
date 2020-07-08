import ini from 'ini';
import fs  from 'fs';
import path from 'path';

const prod = process.env.NODE_ENV === 'production';

const file = fs.readFileSync(path.join(process.cwd(),`config/${process.env.CONFIG_NAME || 'site'}/${ prod ? '' : 'dev.'}config.ini`),{encoding:'utf-8'});

const config = ini.decode(file);

export default config;