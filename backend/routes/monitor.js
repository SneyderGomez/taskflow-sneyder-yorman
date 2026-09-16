import { Router } from 'express';
import * as controller from '../controllers/monitorController.js';

const router = Router();

router.get('/', controller.monitor);

export default router;