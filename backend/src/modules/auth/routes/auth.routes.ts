import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../../../middleware/validation';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/validate', authController.validateToken);

export default router;
