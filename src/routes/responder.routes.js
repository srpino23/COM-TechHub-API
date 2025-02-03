import { Router } from "express";
const router = Router();

import * as ResponderCtrl from "../controllers/responder.controller";

router.get("/getResponders", ResponderCtrl.getResponders);

export default router;
