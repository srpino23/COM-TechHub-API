import Employee from "../models/Employee";

export const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminPassword = "159753";
    let message, data;

    if (password === adminPassword) {
      const user = await Employee.findOne({ docket: username });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      message = "Usuario obtenido correctamente";
      data = user;

      res.status(200).json({ message, data });
    } else {
      const allowedPositions = ["Supervisor", "Operador"];
      const allowedPasswords = ["supervisor", "operador"];

      const user = await Employee.findOne({ docket: username });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (!allowedPositions.includes(user.position)) {
        return res
          .status(403)
          .json({ error: "Acceso solo para supervisores y operadores" });
      }

      if (!allowedPasswords.includes(password)) {
        return res.status(401).json({ error: "Contraseña no autorizada" });
      }

      message = "Usuario obtenido correctamente";
      data = user;

      res.status(200).json({ message, data });
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};
