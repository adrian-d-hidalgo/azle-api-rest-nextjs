import express from 'express';
import cors from "cors";

import { AppRouter } from './routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.post('/test', (req, res) => {
    res.statusCode = 200;
    res.send(req.body);
});

app.get('/health', (req, res) => {
    res.statusCode = 200;
    res.send([1, "2", "3"]);
});

app.use(AppRouter);
