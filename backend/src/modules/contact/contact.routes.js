import { Router } from 'express';
import nodemailer from "nodemailer";

import { sendContactMessage } from './contact.controller.js';

const router = Router();

router.post('/', sendContactMessage);

export default router;
