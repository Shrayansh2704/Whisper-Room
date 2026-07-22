import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { setupWebSocketServer } from "./websocket/index.js";

const server = http.createServer(app);

setupWebSocketServer(server);

server.listen(env.PORT, ()=>{
    console.log(`Server running on http://localhost:${env.PORT}`);
});

