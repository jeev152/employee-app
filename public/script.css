const employeeList = document.getElementById("employee-list");
const employeeForm = document.getElementById("employee-form");
const message = document.getElementById("message");

async function loadEmployees() {
  const response = await fetch("/api/employees");
  const employees = await response.json();

  employeeList.innerHTML = "";

  employees.forEach((employee) => {
    const employeeBox = document.createElement("div");

    employeeBox.className = "employee";

    employeeBox.innerHTML = `
      <strong>${employee.name}</strong>
      <p>Department: ${employee.department}</p>
    `;

    employeeList.appendChild(employeeBox);
  });
}

employeeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;

  const response = await fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      department: department
    })
  });

  if (response.ok) {
    message.textContent = "Employee added successfully.";

    employeeForm.reset();
    await loadEmployees();
  } else {
    message.textContent = "Unable to add employee.";
  }
});

loadEmployees();