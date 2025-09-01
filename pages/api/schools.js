import mysql from 'mysql2/promise';
import multer from 'multer';

// --------------------
// Multer setup
// --------------------
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/schoolImages', // Make sure this folder exists locally
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

// --------------------
// Middleware wrapper
// --------------------
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

// --------------------
// Disable body parser
// --------------------
export const config = { api: { bodyParser: false } };

// --------------------
// API handler
// --------------------
export default async function handler(req, res) {
  let connection;

  try {
    // --------------------
    // Connect to DB
    // --------------------
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // --------------------
    // POST: Add school
    // --------------------
    if (req.method === 'POST') {
      await runMiddleware(req, res, upload.single('image'));

      console.log('Form data:', req.body);
      console.log('File info:', req.file);

      const { name, address, city, state, contact, email_id } = req.body;
      const file = req.file;

      if (!name || !address || !city || !state || !contact || !email_id || !file) {
        return res.status(400).json({ error: 'All fields including image are required' });
      }

      const imagePath = `/schoolImages/${file.filename}`;

      await connection.execute(
        'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, imagePath, email_id]
      );

      return res.status(200).json({ message: 'School added successfully', imagePath });
    }

    // --------------------
    // GET: Fetch schools
    // --------------------
    else if (req.method === 'GET') {
      const [rows] = await connection.execute('SELECT * FROM schools');
      return res.status(200).json(rows);
    }

    // --------------------
    // Other methods
    // --------------------
    else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error adding school:', err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  } finally {
    if (connection) await connection.end();
  }
}
