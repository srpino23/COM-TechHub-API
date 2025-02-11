import { Router } from "express";
const router = Router();

import * as UserCtrl from "../controllers/user.controller";

router.post("/register", UserCtrl.registerUser);
router.post("/login", UserCtrl.loginUser);

export default router;
