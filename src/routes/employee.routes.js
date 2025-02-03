import { Router } from "express";
const router = Router();

import * as EmployeeCtrl from "../controllers/employee.controller";

router.post("/addEmployee", EmployeeCtrl.addEmployee);

router.get("/getEmployees", EmployeeCtrl.getEmployees);

export default router;
