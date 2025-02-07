import { Router } from "express";
const router = Router();

import * as UserCtrl from "../controllers/user.controller";

router.post("/getUser", UserCtrl.getUser);

router.post("/setPassword", UserCtrl.setPassword);

export default router;
