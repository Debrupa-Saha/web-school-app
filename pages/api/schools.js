import mysql from 'mysql2/promise';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/schoolImages',
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

// Helper to run multer in Next.js API route
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // required for file upload
  },
};

export default async function handler(req, res) {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    if (req.method === 'POST') {
      // Run multer
      await runMiddleware(req, res, upload.single('image'));

      const { name, address, city, state, contact, email_id } = req.body;
      const image = req.file ? req.file.filename : null;

      await connection.execute(
        'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, image, email_id]
      );

      res.status(200).json({ message: 'School added successfully' });
    } else if (req.method === 'GET') {
      const [rows] = await connection.execute('SELECT * FROM schools');
      res.status(200).json(rows);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    await connection.end();
  }
}
