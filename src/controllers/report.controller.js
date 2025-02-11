import Report from "../models/Report";

export const createReport = async (req, res) => {
  const { name, surname, team, startTime } = req.body;
  try {
    const newReport = new Report({ name, surname, team, startTime, status: "in progress" });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const finishJob = async (req, res) => {
  const { id, endTime, supplies, summary, location, changes } = req.body;
  const imageUrl = req.file ? `http://172.25.67.77:2300/files/${req.file.filename}` : null;
  try {
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.endTime = endTime;
    report.supplies = supplies;
    report.summary = summary;
    report.location = location;
    report.changes = changes;
    report.imageUrl = imageUrl;
    report.status = "completed";

    await report.save();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
