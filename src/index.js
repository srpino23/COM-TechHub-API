import app from "./app";
import "./database";
import { createServer } from "http";
import { initializeSocket } from "./socket.js";

// Crear el servidor HTTP
const server = createServer(app);

// Inicializar Socket.IO
initializeSocket(server);

// Iniciar el servidor
server.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
