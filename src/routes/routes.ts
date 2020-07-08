import express from 'express';
import config from '../vender/config';
import { getHome,privacy }  from '../controller/site';

const router = express.Router();


router.get('/',getHome);


export default router;
