import { Server } from 'azle';
import express from 'express';
import * as cors from "cors";

export default Server(() => {
    const app = express();
    app.use(cors());

    app.use(express.json());

    app.get('/', (req, res) => {
        res.send("Hello, World!");
    });

    return app.listen();
});
