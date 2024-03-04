const express = require('express');
const mysql = require('mysql2/promise'); // Use 'mysql2/promise' for async/await support
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

const config = {
  host: 'localhost',
  user: 'Aayush',
  password: '123456',
  database: 'Stud',
};

const pool = mysql.createPool(config);

app.use(express.json());

app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Students');
    res.json(rows);
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.get('/api/students/:RollNo', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Students WHERE RollNo = ?', [req.params.RollNo]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { Name, RollNo } = req.body;
    const [result] = await pool.execute('INSERT INTO Students (Name, RollNo) VALUES (?, ?)', [Name, RollNo]);
    res.json({ id: result.insertId, Name, RollNo });
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.put('/api/students/:RollNo', async (req, res) => {
  try {
    const { Name } = req.body;
    await pool.execute('UPDATE Students SET Name = ? WHERE RollNo = ?', [Name, req.params.RollNo]);
    res.json({ RollNo: req.params.RollNo, Name });
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.delete('/api/students/:RollNo', async (req, res) => {
  try {
    await pool.execute('DELETE FROM Students WHERE RollNo = ?', [req.params.RollNo]);
    res.json({ RollNo: req.params.RollNo, message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
