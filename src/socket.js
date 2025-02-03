import { Server } from "socket.io";
import { updateReport } from "./controllers/report.controller.js";

const reports = {};
const connectedUsers = {}; // Lista de usuarios conectados
const userChanges = {}; // Lista de cambios por usuario

// Función para inicializar Socket.IO
export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Función para emitir la lista de usuarios conectados
  const emitConnectedUsers = () => {
    io.emit("connectedUsers", Object.values(connectedUsers));
  };

  // Escuchar eventos de conexión de Socket.IO
  io.on("connection", (socket) => {
    // Manejar evento de usuario conectado
    socket.on("userConnected", ({ name, surname, role }) => {
      connectedUsers[socket.id] = {
        id: socket.id,
        name,
        surname,
        role,
        changes: [],
      };
      console.log(`Usuario conectado: ${name} ${surname} con rol: ${role}`);
      emitConnectedUsers(); // Emitir la lista de usuarios conectados
    });

    // Manejar unirse a un room específico por ID
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Usuario se unió al room ${roomId}`);
    });

    // Manejar cambios en los campos
    socket.on("editFields", async ({ id, changes, user, role }) => {
      try {
        // Actualizar el estado en memoria
        if (!reports[id]) reports[id] = {};
        changes.forEach(({ name, value }) => {
          reports[id][name] = value;

          // Guardar el cambio en la lista del usuario
          if (!userChanges[user]) userChanges[user] = [];
          userChanges[user].push({ id, name, value, role });
        });

        // Actualizar la base de datos
        const updates = changes.reduce((acc, { name, value }) => {
          acc[name] = value;
          return acc;
        }, {});
        const result = await updateReport(id, updates, user, role);

        if (result.success) {
          // Emitir la actualización a otros usuarios en el mismo room
          changes.forEach(({ name, value }) => {
            socket.to(id).emit("updateField", { id, name, value, role });
          });
          console.log(`Campos actualizados en reporte ${id}`);
        } else {
          console.error("Error al actualizar la base de datos:", result.error);
          socket.emit("error", {
            message: "No se pudo actualizar la base de datos",
          });
        }
      } catch (error) {
        console.error("Error al manejar editFields:", error);
        socket.emit("error", { message: "Error interno del servidor" });
      }
    });

    // Manejar desconexión
    socket.on("disconnect", () => {
      const user = connectedUsers[socket.id];
      if (user) {
        console.log(`Usuario desconectado: ${user.name} con rol: ${user.role}`);
        delete connectedUsers[socket.id];
        emitConnectedUsers(); // Emitir la lista de usuarios conectados
      } else {
        console.log("Usuario desconectado");
      }
    });
  });
};
