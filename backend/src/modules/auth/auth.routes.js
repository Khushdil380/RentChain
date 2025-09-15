import { Router } from 'express';
import {
  signup,
  login,
  requestOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  checkUnique,
  me,
  logout
} from './auth.controller.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);
router.get('/unique', checkUnique); // ?username=&email=&phone=
router.get('/me', me);
router.post('/logout', logout);

export default router;
