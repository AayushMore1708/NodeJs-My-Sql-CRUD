const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

const config = {
  server: 'DESKTOP-381RTJ2',
  database: 'Stud',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: '121212',
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    port: 1433,
  },
};

app.use(express.json());

app.get('/api/students', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Student');
    res.json(result.recordset);
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.get('/api/students/:RollNo', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('RollNo', sql.Int, req.params.RollNo)
      .query('SELECT * FROM Student WHERE RollNo = @RollNo');
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { Name, RollNo } = req.body;
    const result = await pool
      .request()
      .input('Name', sql.VarChar, Name)
      .input('RollNo', sql.Int, RollNo)
      .query('INSERT INTO Student (Name, RollNo) VALUES (@Name, @RollNo); SELECT SCOPE_IDENTITY() AS newStudentId');
    res.json({ id: result.recordset[0].newStudentId, Name, RollNo });
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.put('/api/students/:RollNo', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { Name } = req.body;
    const result = await pool
      .request()
      .input('RollNo', sql.Int, req.params.RollNo)
      .input('Name', sql.VarChar, Name)
      .query('UPDATE Student SET Name = @Name WHERE RollNo = @RollNo');
    res.json({ RollNo: req.params.RollNo, Name });
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.delete('/api/students/:RollNo', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('RollNo', sql.Int, req.params.RollNo)
      .query('DELETE FROM Student WHERE RollNo = @RollNo');
    res.json({ RollNo: req.params.RollNo, message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
