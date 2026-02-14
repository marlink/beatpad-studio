import { Router } from 'express';
import bcrypt from 'bcryptjs'; // Need to install this
import { query } from '../db';
import { signToken } from '../utils/jwt';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = registerSchema.parse(req.body);

        // Check existing
        const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const result = await query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
            [email, hash]
        );

        const token = signToken({ id: result.rows[0].id, email });
        res.json({ token, user: { id: result.rows[0].id, email } });

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = signToken({ id: user.id, email: user.email });
        res.json({ token, user: { id: user.id, email: user.email } });

    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
