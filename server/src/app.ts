import express from "express";
import cors from "cors";

import {env} from "./config/env.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin : env.CLIENT_URL,
    credentials : true,
}));

app.get("/", (req, res)=>{
    res.json({
        message : "Whisper server is runnning",
    });
});

export default app;