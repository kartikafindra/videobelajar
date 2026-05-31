import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import courseRoutes from './routes/courses.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve uploaded files secara statis
app.use('/uploads', express.static(join(__dirname, '../public/uploads')));

// Auth routes (register, login, verify-email)
app.use('/', authRoutes);

// Resource routes
app.use('/course', courseRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/upload', uploadRoutes);

// postman check
// app.get('/', (req, res) => {
//   res.json({
//     message: 'VideoBelajar API is running',
//     endpoints: {
//       course: ['GET /course', 'GET /course/:id', 'POST /course', 'PUT /course/:id', 'PATCH /course/:id', 'DELETE /course/:id'],
//       user:   ['GET /user',   'GET /user/:id',   'POST /user',   'PUT /user/:id',   'PATCH /user/:id',   'DELETE /user/:id'],
//       order:  ['GET /order',  'GET /order/:id',  'POST /order',  'PATCH /order/:id', 'DELETE /order/:id'],
//     },
//   });
// });

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log('Endpoints tersedia:');
  console.log('  POST   /register');
  console.log('  POST   /login');
  console.log('  GET    /verify-email?token=...');
  console.log('  GET    /course?topic=&sortBy=&search=');
  console.log('  POST   /upload  (form-data, field: file)');
});
