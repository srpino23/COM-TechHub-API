import Responder from "../models/Responder";

export const getResponders = async (req, res) => {
  try {
    const responders = await Responder.find();

    res.json(responders);
  } catch (error) {
    console.error("Error al obtener los reportes:", error);
    res.status(500).json({ error: "Error al obtener los reportes" });
  }
};
