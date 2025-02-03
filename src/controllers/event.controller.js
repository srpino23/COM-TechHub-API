import Events from "../models/Event";

export const getEvents = async (req, res) => {
  try {
    const events = await Events.find();

    res.json(events);
  } catch (error) {
    console.error("Error al obtener los reportes:", error);
    res.status(500).json({ error: "Error al obtener los reportes" });
  }
};
