import express from 'express';
import * as marketController from '../controller/marketController.js';

const router = express.Router();

router.get('/listed', marketController.listed);
router.get('/mint', marketController.mint);
router.post('/refresh-owner', marketController.refreshOwner);
router.post('/refresh-listing', marketController.refreshListingStatus);
router.post('/refresh-price', marketController.refreshPrice);

export default router;
