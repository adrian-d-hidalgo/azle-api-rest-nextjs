import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const AuthRoutes = express.Router();

const users: { username: string, password: string }[] = [];

AuthRoutes.post('/signup', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ username, password });

    try {
        const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret');

        res.json({ token });
    } catch (error: any) {
        console.log(error.message);
        res.json(error.message);
    }
});
