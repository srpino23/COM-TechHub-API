import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

// Importar las rutas
import UserRoutes from "./routes/user.routes";
import ReportRoutes from "./routes/report.routes";

const app = express();

// Configuración
app.set("port", process.env.PORT || 2300);

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/files", express.static(path.join(__dirname, "../public/files")));

// Rutas
app.use("/api/user", UserRoutes);
app.use("/api/report", ReportRoutes);

export default app;
