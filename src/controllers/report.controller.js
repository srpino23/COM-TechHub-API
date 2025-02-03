import Report from "../models/Report";

export const createReport = async (req, res) => {
  try {
    const { operator, docket } = req.body;

    // Obtener la hora actual en Buenos Aires
    const now = new Date();
    const utcOffset = -3; // Buenos Aires está en UTC-3
    const buenosAiresTime = new Date(
      now.getTime() + utcOffset * 60 * 60 * 1000
    );

    // Formatear la hora en "HH:mm"
    const hour = buenosAiresTime.toISOString().slice(11, 16);

    // Generar el código en el formato "DDMMYYXXX"
    const dateCode =
      String(buenosAiresTime.getDate()).padStart(2, "0") +
      String(buenosAiresTime.getMonth() + 1).padStart(2, "0") +
      String(buenosAiresTime.getFullYear()).slice(2, 4);

    // Contar los reportes existentes para el mismo día
    const existingReports = await Report.find({
      code: { $regex: `^${dateCode}` },
    });

    const sequenceNumber = String(existingReports.length + 1).padStart(3, "0");
    const code = dateCode + sequenceNumber;

    const report = new Report({
      status: "open",
      hour,
      code,
      operator,
      docket,
    });
    await report.save();

    res
      .status(201)
      .json({ message: "Reporte creado correctamente", data: report });
  } catch (error) {
    console.error("Error al crear el reporte:", error);
    res.status(500).json({ error: "Error al crear el reporte" });
  }
};

export const updateReport = async (id, updates, user, role) => {
  try {
    const report = await Report.findById(id);

    if (report) {
      Object.keys(updates).forEach((key) => {
        if (key in report) {
          report[key] = updates[key];
        }
      });

      // Agregar cambios al campo history
      if (!report.history) report.history = [];
      const now = new Date();
      const utcOffset = -3; // Buenos Aires está en UTC-3
      const buenosAiresTime = new Date(
        now.getTime() + utcOffset * 60 * 60 * 1000
      );
      report.history = [
        ...report.history,
        { user, role, updates, timestamp: buenosAiresTime },
      ];

      if (report.hour && report.mobileArrivalTime) {
        const [hourHours, hourMinutes] = report.hour.split(":").map(Number);
        const [arrivalHours, arrivalMinutes] = report.mobileArrivalTime
          .split(":")
          .map(Number);

        const hourDate = new Date(0, 0, 0, hourHours, hourMinutes);
        const arrivalDate = new Date(0, 0, 0, arrivalHours, arrivalMinutes);

        let diff = (arrivalDate - hourDate) / 1000 / 60; // diferencia en minutos

        const diffHours = Math.floor(diff / 60);
        const diffMinutes = diff % 60;

        const responseTime = `${String(diffHours).padStart(2, "0")}:${String(
          diffMinutes
        ).padStart(2, "0")}`;
        report.responseTime = responseTime;
      }

      await report.save();
      console.log("Reporte actualizado correctamente en la base de datos");
      return { success: true, data: report };
    } else {
      console.error("Reporte no encontrado");
      return { success: false, error: "Reporte no encontrado" };
    }
  } catch (error) {
    console.error("Error al actualizar el reporte:", error);
    return { success: false, error: "Error al actualizar el reporte" };
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();

    res.json(reports);
  } catch (error) {
    console.error("Error al obtener los reportes:", error);
    res.status(500).json({ error: "Error al obtener los reportes" });
  }
};

export const getReportById = async (req, res) => {
  try {
    const id = req.params.id;
    const report = await Report.findById(id);

    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ error: "Reporte no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    res.status(500).json({ error: "Error al obtener el reporte" });
  }
};
