import app from "./app";
import "./database";

// Iniciar el servidor
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
