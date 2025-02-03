import { Router } from "express";
const router = Router();

import * as ReportCtrl from "../controllers/report.controller";

router.post("/createReport", ReportCtrl.createReport);

router.post("/updateReport/:id", ReportCtrl.updateReport);

router.get("/getReports", ReportCtrl.getReports);

router.get("/getReport/:id", ReportCtrl.getReportById);

export default router;
