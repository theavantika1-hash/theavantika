const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const { connectDB } = require('./db/dbconnection.js');

// Load environment variables from .env file
dotenv.config();

const app = express();




// CORS configuration
const allowedOrigins = [

    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:5179',
    'http://localhost:5180',
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS policy: This origin is not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Allow embedding public files (TC PDFs) in iframes from the dev frontend origins
app.use((req, res, next) => {
    // Use Content-Security-Policy frame-ancestors for modern browsers
    res.setHeader(
        'Content-Security-Policy',
        "frame-ancestors 'self' http://localhost:5173 http://localhost:5174 http://localhost:5175"
    );
    // Also clear any existing X-Frame-Options header that might block embedding
    res.removeHeader && res.removeHeader('X-Frame-Options');
    next();
});

// Middleware setup
// Stripe webhook needs raw body for signature verification
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Food Routes
const foodRoutes = require('./src/routes/foodRoutes');
app.use('/api/foods', foodRoutes);

// User Routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes);

// Cart Routes
const cartRoutes = require('./src/routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// Order Routes
const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api/orders', orderRoutes);
app.use('/api/order', orderRoutes);

// Dashboard Routes
const dashboardRoutes = require('./src/routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

// Coupon Routes
const couponRoutes = require('./src/routes/couponRoutes');
app.use('/api/coupons', couponRoutes);

// Delivery Boy Routes
const deliveryBoyRoutes = require('./src/routes/deliveryBoyRoutes');
app.use('/api/delivery-boy', deliveryBoyRoutes);






// Secure proxy endpoint to stream files from backend/public
// Usage: /public-file?path=uploads/filename.pdf
// const { protect } = require('./src/middleware/authMiddleware');
// app.get('/public-file', async (req, res) => {
//     try {
//         const requested = String(req.query.path || '');
//         if (!requested) return res.status(400).json({ success: false, message: 'Missing path' });

//         // Only allow files inside the uploads folder to prevent traversal
//         const normalizedRequested = requested.replace(/^\//, ''); // remove leading slash
//         if (!normalizedRequested.startsWith('uploads/')) {
//             return res.status(403).json({ success: false, message: 'Forbidden' });
//         }

//         const fullPath = path.join(__dirname, normalizedRequested);
//         const normalizedFull = path.normalize(fullPath);
//         const uploadsRoot = path.normalize(path.join(__dirname, 'uploads'));

//         // Ensure resolved path is inside the uploads directory
//         if (!normalizedFull.startsWith(uploadsRoot)) {
//             return res.status(403).json({ success: false, message: 'Forbidden' });
//         }

//         const fs = require('fs');
//         if (!fs.existsSync(normalizedFull)) {
//             const host = req.headers.host || '';
//             if (host.includes('localhost') || host.includes('127.0.0.1')) {
//                 const axios = require('axios');
//                 const prodUrl = `https://rizeworldmain.onrender.com/${normalizedRequested}`;
//                 try {
//                     // Fetch the file from production backend
//                     const response = await axios({
//                         method: 'get',
//                         url: prodUrl,
//                         responseType: 'stream'
//                     });

//                     // Create write stream to save the file locally
//                     const writer = fs.createWriteStream(normalizedFull);
//                     response.data.pipe(writer);

//                     await new Promise((resolve, reject) => {
//                         writer.on('finish', resolve);
//                         writer.on('error', reject);
//                     });
//                 } catch (downloadErr) {
//                     console.error(`Failed to download missing file from production fallback: ${prodUrl}`, downloadErr.message);
//                     return res.status(404).json({ success: false, message: 'File not found' });
//                 }
//             } else {
//                 return res.status(404).json({ success: false, message: 'File not found' });
//             }
//         }

//         // Set permissive embedding headers for the proxied response
//         res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:5173 http://localhost:5174 http://localhost:5175");
//         res.setHeader('X-Content-Type-Options', 'nosniff');
//         // Stream file
//         return res.sendFile(normalizedFull, (err) => {
//             if (err) {
//                 console.error('Error sending file:', err);
//                 if (!res.headersSent) res.status(404).end();
//             }
//         });
//     } catch (err) {
//         console.error('public-file error', err);
//         return res.status(500).json({ success: false, message: 'Server error' });
//     }
// });



// Setup Socket.IO using the utility
// const server = http.createServer(app);
// const socketUtil = require('./socket');
// const io = socketUtil.init(server);

// io.on('connection', (socket) => {
//     console.log(`Client connected: ${socket.id}`);
// });

// Setup view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// Connect to database and start server
connectDB();




app.listen(process.env.PORT || 45000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 45000}`);
});