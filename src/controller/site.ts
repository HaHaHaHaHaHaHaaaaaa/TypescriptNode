import express from 'express';
import config from '../vender/config';
const router = express.Router();

const getHome = router.get('/',(req,res)=>{res.render('index',{'config':config})});
const privacy = router.get('/privacy',(req,res)=>{res.send('')});
export  {getHome,privacy}
