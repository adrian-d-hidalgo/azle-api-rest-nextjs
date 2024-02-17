import express from 'express';
import cors from "cors";

import { AppRouter } from './routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.post('/test', (req, res) => {
    res.send(req.body);
});

app.get('/health', (req, res) => {
    res.statusCode = 204;
    res.send("OK");
});

app.use(AppRouter);
