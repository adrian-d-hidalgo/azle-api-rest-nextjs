import { ic } from 'azle';
import cors from "cors";
import express from 'express';

import { AppRouter } from './routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.post('/test', (req, res) => {
    res.json(req.body);
});

app.get('/whoami', (req, res) => {
    res.statusCode = 200;
    res.send(ic.caller());
});

app.get('/health', (req, res) => {
    res.statusCode = 204;
    res.send("OK");
});

app.use(AppRouter);
