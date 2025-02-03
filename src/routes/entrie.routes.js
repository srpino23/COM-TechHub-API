import { Router } from "express";
const router = Router();

import * as EntrieCtrl from "../controllers/entrie.controller";

router.get("/getEntries", EntrieCtrl.getEntries);

export default router;
