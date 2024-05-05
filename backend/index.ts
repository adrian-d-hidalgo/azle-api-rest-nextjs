import { ic } from 'azle';
import cors from "cors";
import express, { NextFunction, Request, Response } from 'express';

const app = express();

app.use(cors());
app.use(express.json());

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.message);
    res.status(500).send('Something broke!');
});

function AuthGuard(req: Request, res: Response, next: NextFunction) {
    if (ic.caller().isAnonymous()) {
        res.status(401);
        res.send("You are not authorized to access this resource.");
    } else {
        next();
    }
}

app.post("/contacts", AuthGuard, (req, res) => {
    console.log({ body: req.body });
    res.send().statusCode = 201;
});

app.get('/health', (req, res) => {
    res.send().statusCode = 204;
});

app.listen();
