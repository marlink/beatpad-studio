import { Router } from 'express';
import { query } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all user projects
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.user.id;
        const result = await query('SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Save a project
router.post('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.user.id;
        const { name, bpm, data, isPublic } = req.body;

        const result = await query(
            `INSERT INTO projects (user_id, name, bpm, data, is_public) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
            [userId, name, bpm, data, isPublic || false]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save project' });
    }
});

// Update a project
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;
        const { name, bpm, data, isPublic } = req.body;

        const result = await query(
            `UPDATE projects 
             SET name = $1, bpm = $2, data = $3, is_public = $4, updated_at = NOW() 
             WHERE id = $5 AND user_id = $6 
             RETURNING *`,
            [name, bpm, data, isPublic, projectId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found or unauthorized' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update project' });
    }
});

export default router;
