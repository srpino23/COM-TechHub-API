import { Router } from "express";
const router = Router();

import * as UserCtrl from "../controllers/user.controller";

router.post("/getUser", UserCtrl.getUser);

export default router;
