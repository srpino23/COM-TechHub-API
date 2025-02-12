import { Router } from "express";
const router = Router();

import * as ReportCtrl from "../controllers/report.controller";

import multer from "../libs/multer";

router.post("/createReport", ReportCtrl.createReport);

router.post(
  "/finishJob",
  multer.single("image"),
  ReportCtrl.finishJob
);

router.get("/getReports", ReportCtrl.getReports);

export default router;