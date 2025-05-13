import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const router = Router();

router.post('/registrar', registerValidator, register);
router.post('/login', loginValidator, login);

export default router;