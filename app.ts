import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger  from './src/vender/logger';
import sassMiddleware from 'node-sass-middleware';
import compression from 'compression';
import useragent  from 'express-useragent';
import timeout from 'connect-timeout';
import requestIp from 'request-ip';
import {
  resolve as urlResolve,
  parse as urlParse
} from 'url';




import config from './src/vender/config';
import gamesRouter from './src/routes/routes';

// const prod = process.env.NODE_ENV === 'production';
const prod = (config.app.production || process.env.NODE_ENV) === 'production';
const templateDir = path.join(__dirname,'src/views');
const publicDir = path.join(__dirname,'src/public') ;

const app = express();
// view engine setup
app.set('views', templateDir);
app.set('view engine', 'pug');
app.disable('x-powered-by');
// app.set('etag',false);
app.locals.basedir = publicDir;

import webpackConfig from './webpack.dev.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';

if (!prod) {
  const serverWebpackConfig = webpackConfig[0];
  const compiler = webpack(serverWebpackConfig);
  app.use(webpackDevMiddleware(compiler,{
    noInfo: true, publicPath: serverWebpackConfig.output.path
  }));
  app.use(webpackHotMiddleware(compiler,{
    log:console.log,path:'/__webpack_hmr',heartbeat:20*1000
  }))
}


app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());


function haltOnTimedout(req, res, next) {
  if (!req.timedout){
    next();
  }else{
    if (!prod){
      logger.error(`request timeout from ${req.get('user-agent')} ip:${req.clientIp || 'none'} acceptsLanguages:${req.acceptsLanguages()}    ${new Date().toLocaleString('zh')}`);
    }else{}
  }
}

if(!prod){
  app.use(compression({
    filter: (req, res) =>{
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
      }
      // fallback to standard filter function
      return compression.filter(req, res)
    },
    level: 6,
  }))

  app.use(sassMiddleware({
    src: path.join(__dirname, 'src/public'),
    dest: path.join(__dirname, 'src/public'),
    outputStyle: 'compressed',
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: false
  }));
}

app.use(timeout('90s',{respond:false}));
app.use(haltOnTimedout);
app.use(express.static(path.join(__dirname, 'src/public'), {
  cacheControl: true,
  immutable: false,
  dotfiles: 'allow',
  maxAge: 15552000000,
  lastModified: true
}));

app.use(useragent.express());
app.use(requestIp.mw());
app.use((req, res, next)=> {
  const pragma = req.get('pragma') ? req.get('pragma').toLowerCase() === 'no-cache' : false;
  const cacheControl = req.get('cache-Control') ? req.get('cache-Control').toLowerCase() === 'no-cache' : false;
  req['shouldRefresh'] = false/* pragma || cacheControl */;
  req['kk'] = urlParse(req.url).pathname.trim();
  if(!prod){
    // logger.error(req.clientIp || 'none');
    logger.info(`request from ${req.get('user-agent')} ip:${req.clientIp || 'none'} acceptsLanguages:${req.acceptsLanguages()}    ${new Date().toLocaleString('zh')}`);
  }
  // res.cookie('testip',encodeURI(req.clientIp+'.888'),{ expires:new Date(Date.now()+15000) ,httpOnly:true});
  res.set('Cache-Control','private,max-age=7200');

  res.setHeader('X-XSS-Protection','1;mode=block');
  res.setHeader('X-Frame-Option','DENY');
  res.setHeader('X-Content-Type-Options','nosniff');

  next();
});
app.use(haltOnTimedout);
app.use(gamesRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  if (!prod) {
    logger.error(`request 404 ${req.url} from ${req.get('user-agent')} ip:${req.clientIp || 'none'} acceptsLanguages:${req.acceptsLanguages()}    ${new Date().toLocaleString('zh')}`);
  }else{

  }
  next(createError(404));
  // res.redirect('/');
});

// error handler
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;