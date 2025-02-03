import Employee from "../models/Employee";

export const addEmployee = async (req, res) => {
  try {
    const {
      shift,
      docket,
      name,
      surname,
      position,
      seniority,
      remainingItems,
      remainingLicenses,
      remainingStudyDay,
      jobApplications,
      overtime,
      sanctions,
      absences,
      lateArrivals,
      entryForm,
      exitForm,
      category,
    } = req.body;

    let message, data;

    const employee = new Employee({
      shift,
      docket,
      name,
      surname,
      position,
      seniority,
      remainingItems,
      remainingLicenses,
      remainingStudyDay,
      jobApplications,
      overtime,
      sanctions,
      absences,
      lateArrivals,
      entryForm,
      exitForm,
      category,
    });

    await employee.save();

    message = "Empleado agregado correctamente";
    data = employee;

    res.status(201).json({ message, data });
  } catch (error) {
    console.error("Error al agregar el empleado:", error);
    res.status(500).json({ error: "Error al agregar el empleado" });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    res.json(employees);
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    res.status(500).json({ error: "Error al obtener los empleados" });
  }
};

export const editEmployee = async (req, res) => {
  try {
    const {
      id,
      shift,
      docket,
      name,
      surname,
      position,
      seniority,
      remainingItems,
      remainingLicenses,
      remainingStudyDay,
      jobApplications,
      overtime,
      sanctions,
      absences,
      lateArrivals,
      entryForm,
      exitForm,
      category,
    } = req.body;

    let message, data;

    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        shift,
        docket,
        name,
        surname,
        position,
        seniority,
        remainingItems,
        remainingLicenses,
        remainingStudyDay,
        jobApplications,
        overtime,
        sanctions,
        absences,
        lateArrivals,
        entryForm,
        exitForm,
        category,
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    message = "Empleado editado correctamente";
    data = employee;

    res.json({ message, data });
  } catch (error) {
    console.error("Error al editar el empleado:", error);
    res.status(500).json({ error: "Error al editar el empleado" });
  }
};
