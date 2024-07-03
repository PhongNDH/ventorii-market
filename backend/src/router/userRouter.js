import express from 'express';
import * as userController from '../controller/userController.js';

const router = express.Router();

router.post('/login', userController.login);
router.get('/profile', userController.profile);

export default router;
