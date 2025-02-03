import { Router } from "express";
const router = Router();

import * as EventCtrl from "../controllers/event.controller";

router.get("/getEvents", EventCtrl.getEvents);

export default router;
