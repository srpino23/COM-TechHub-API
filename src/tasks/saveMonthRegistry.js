import "../database";
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

import Employee from "../models/Employee";
import Shift from "../models/Shift";

export async function saveMonthRegistry() {
  try {
    const browser = await puppeteer.launch({ headless: true });

    const downloadPath = path.resolve(__dirname, "downloads");
    fs.mkdirSync(downloadPath, { recursive: true });

    const page = await browser.newPage();

    try {
      await page._client().send("Browser.setDownloadBehavior", {
        behavior: "allow",
        downloadPath,
      });

      const loginUrl = "https://asistencia.tresdefebrero.gov.ar/login.aspx";
      await page.goto(loginUrl, { waitUntil: "load" });

      await page.type("#ctl00_ContentPlaceHolder1_txtUser", "1133");
      await page.type("#ctl00_ContentPlaceHolder1_txtPwd", "COM123");

      await Promise.all([
        page.click("#ctl00_ContentPlaceHolder1_cmdAceptar"),
        page.waitForNavigation({ waitUntil: "load" }),
      ]);

      const consultaUrl =
        "https://asistencia.tresdefebrero.gov.ar/RptCierre.aspx";
      await page.goto(consultaUrl, { waitUntil: "load" });

      await page.evaluate(() => {
        const desdeField = document.querySelector(
          "#ctl00_ContentPlaceHolder1_txtDesde"
        );
        const hastaField = document.querySelector(
          "#ctl00_ContentPlaceHolder1_txtHasta"
        );
        if (desdeField) desdeField.value = "";
        if (hastaField) hastaField.value = "";
      });

      const currentDate = new Date();
      const firstDayOfLastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      const lastDayOfLastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );

      const firstDayFormatted = firstDayOfLastMonth.toLocaleDateString("es-AR");
      const lastDayFormatted = lastDayOfLastMonth.toLocaleDateString("es-AR");

      await page.type("#ctl00_ContentPlaceHolder1_txtDesde", firstDayFormatted);
      await page.type("#ctl00_ContentPlaceHolder1_txtHasta", lastDayFormatted);

      await page.select("#ctl00_ContentPlaceHolder1_ddlOficinas", "-1");
      await page.select("#ctl00_ContentPlaceHolder1_ddlGrupo", "7");

      await Promise.all([
        page.click("#ctl00_ContentPlaceHolder1_btnCargar"),
        page.waitForNavigation({ waitUntil: "load" }),
      ]);

      await page.click("#ctl00_ContentPlaceHolder1_btnExportar");

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const downloadedFiles = fs.readdirSync(downloadPath);

      const excelFile = downloadedFiles.find(
        (file) => file.endsWith(".xls") || file.endsWith(".xlsx")
      );

      if (!excelFile)
        throw new Error("No se encontró el archivo Excel descargado.");

      const newFilePath = path.join(downloadPath, excelFile);

      const workbook = xlsx.readFile(newFilePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      for (const employeeData of sheetData) {
        if (employeeData["Legajo"]) {
          const employeeLegajo = employeeData["Legajo"].toString();

          const employee = await Employee.findOne({ docket: employeeLegajo });

          if (employee) {
            const fichada = {
              date: employeeData["Fecha"],
              entry: employeeData["Fichada entrada"],
              exit: employeeData["Fichada salida"],
            };

            // Inicializar las listas si no existen
            if (!employee.entryForm) employee.entryForm = [];
            if (!employee.exitForm) employee.exitForm = [];

            const existingEntry = employee.entryForm.find(
              (entry) => entry.date === fichada.date
            );
            const existingExit = employee.exitForm.find(
              (exit) => exit.date === fichada.date
            );

            if (!existingEntry || !existingExit) {
              const entry = {
                date: fichada.date,
                value: fichada.entry,
              };
              const exit = {
                date: fichada.date,
                value: fichada.exit,
              };

              if (!existingEntry) employee.entryForm.push(entry);
              if (!existingExit) employee.exitForm.push(exit);

              await Employee.updateOne(
                { docket: employeeLegajo },
                {
                  $set: {
                    entryForm: employee.entryForm,
                    exitForm: employee.exitForm,
                  },
                }
              );

              await employee.save();
            }
          }
        }
      }

      const shifts = await Shift.find();
      const employees = await Employee.find();

      const lateArrivals = [];

      for (const employee of employees) {
        for (const shift of shifts) {
          if (shift.shift === employee.shift) {
            for (const entry of employee.entryForm) {
              if (entry.value !== "00:00") {
                const entryTime = new Date(`1970-01-01T${entry.value}:00`);
                const shiftTime = new Date(`1970-01-01T${shift.entry}:00`);
                const diff =
                  (entryTime.getTime() - shiftTime.getTime()) / 60000;

                if (diff > 10) {
                  lateArrivals.push({
                    date: entry.date,
                    value: entry.value,
                    entry: shift.entry,
                    docket: employee.docket,
                  });
                }
              }
            }
          }
        }
      }

      for (const lateArrival of lateArrivals) {
        const employee = await Employee.findOne({ docket: lateArrival.docket });

        if (employee) {
          if (!employee.lateArrivals) {
            employee.lateArrivals = [];
          }

          const existingLateArrival = employee.lateArrivals.find(
            (arrival) =>
              arrival.date === lateArrival.date &&
              arrival.value === lateArrival.value &&
              arrival.entry === lateArrival.entry
          );

          if (!existingLateArrival) {
            employee.lateArrivals.push({
              date: lateArrival.date,
              value: lateArrival.value,
              entry: lateArrival.entry,
            });

            await Employee.updateOne(
              { docket: lateArrival.docket },
              { $set: { lateArrivals: employee.lateArrivals } }
            );
          }
        }
      }

      // Eliminar el archivo descargado
      fs.unlinkSync(newFilePath);
    } catch (error) {
      console.error("Error en el proceso:", error);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error(
      `Error al guardar el registro mensual de empleados: ${error.message}`
    );
  }
}
