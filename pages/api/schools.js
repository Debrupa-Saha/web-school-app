import mysql from 'mysql2/promise';
import multer from 'multer';

// Ensure the upload folder exists
const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Helper to run middleware in Next.js API route
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

// Disable body parser for file uploads
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // Create DB connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    if (req.method === 'POST') {
      // Handle file upload
      await runMiddleware(req, res, upload.single('image'));

      const { name, address, city, state, contact, email_id } = req.body;
      const image = req.file ? `/schoolImages/${req.file.filename}` : null;

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
    res.status(500).json({ error: err.message || 'Database error' });
  } finally {
    await connection.end();
  }
}
