const nextConnect = require('next-connect');
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';

const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, unique);
  },
});
const upload = multer({ storage });

export const config = { api: { bodyParser: false } };

const handler = nextConnect();

async function getPool() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

handler.get(async (req, res) => {
  const pool = await getPool();
  const [rows] = await pool.query('SELECT * FROM schools ORDER BY created_at DESC');
  res.status(200).json(rows);
});

handler.use(upload.single('image'));

handler.post(async (req, res) => {
  const pool = await getPool();
  const { name, address, city, state, contact, email_id } = req.body;
  const imagePath = req.file ? `/schoolImages/${req.file.filename}` : null;

  const sql = `INSERT INTO schools (name, address, city, state, contact, image, email_id) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await pool.query(sql, [
    name,
    address,
    city,
    state,
    contact,
    imagePath,
    email_id,
  ]);

  res.status(200).json({ ok: true, id: result.insertId });
});

export default handler;
