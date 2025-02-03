import express from "express";
import morgan from "morgan";
import cors from "cors";
import cron from "node-cron";

// Importar las rutas
import EmployeeRoutes from "./routes/employee.routes";
import ReportRoutes from "./routes/report.routes";
import UserRoutes from "./routes/user.routes";
import EntrieRoutes from "./routes/entrie.routes";
import EventRoutes from "./routes/event.routes";
import ResponderRoutes from "./routes/responder.routes";

// Funciones de tareas
import { saveMonthRegistry } from "./tasks/saveMonthRegistry";

const app = express();

// Configuración
app.set("port", process.env.PORT || 2300);

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use("/api/employee", EmployeeRoutes);
app.use("/api/report", ReportRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/entrie", EntrieRoutes);
app.use("/api/event", EventRoutes);
app.use("/api/responder", ResponderRoutes);

// Ejecutar las tareas directamente en el hilo principal
function saveMonthRegistryTask() {
  const fechaActual = new Date();
  const diaActual = fechaActual.getDate();
  const horaActual = fechaActual.getHours();

  if (diaActual === 1 && horaActual === 8) {
    saveMonthRegistry();
  } else {
    console.log("No es el momento de ejecutar la tarea");
  }
}

// Configuramos el cron para ejecutar la tarea el primer día de cada mes a las 8:00 AM
cron.schedule("0 8 1 * *", saveMonthRegistryTask);

export default app;
