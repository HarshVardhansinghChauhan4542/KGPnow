import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;