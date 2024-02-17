import express from 'express';
import cors from "cors";

import { AppRouter } from './routes';
import { ic } from 'azle';

export const app = express();

app.use(cors());
app.use(express.json());

app.post('/test', (req, res) => {
    res.send(req.body);
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
