import Entrie from "../models/Entrie";

export const getEntries = async (req, res) => {
  try {
    const entries = await Entrie.find();

    res.json(entries);
  } catch (error) {
    console.error("Error al obtener los reportes:", error);
    res.status(500).json({ error: "Error al obtener los reportes" });
  }
};
