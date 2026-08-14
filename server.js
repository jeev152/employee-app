const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// PostgreSQL connection details
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "employee_admin",
  password: process.env.DB_PASSWORD || "employee_password",
  database: process.env.DB_NAME || "employee_db"
});

// Create employees table if it does not exist
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL
      )
    `);

    console.log("Database connected and employees table is ready.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  }
}

// Retrieve all employees
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Unable to retrieve employees"
    });
  }
});

// Retrieve one employee
app.get("/api/employees/:id", async (req, res) => {
  try {
    const employeeId = Number(req.params.id);

    const result = await pool.query(
      "SELECT * FROM employees WHERE id = $1",
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Unable to retrieve employee"
    });
  }
});

// Add a new employee
app.post("/api/employees", async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({
        message: "Name and department are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO employees (name, department)
       VALUES ($1, $2)
       RETURNING *`,
      [name, department]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Unable to add employee"
    });
  }
});

// Prepare the database and start the server
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();