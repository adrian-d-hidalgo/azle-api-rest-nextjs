import express from 'express';
import cors from "cors";

import { AppRouter } from './routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.statusCode = 200;
});

app.use(AppRouter);
