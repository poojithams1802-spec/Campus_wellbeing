
// Enable CORS for local development and deployed frontend
const allowedOrigins = [
  'https://main.d2u7xywy5yab9fb.amplifyapp.com',
  'https://campus-wellbeing-1kr4.vercel.app',
  'https://campus-wellbeing.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/+$/, ''));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header (curl, server-to-server, etc.)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');

    if (
      allowedOrigins.includes(normalizedOrigin) ||
      normalizedOrigin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS before routes and parsers.
// This also handles browser OPTIONS preflight requests.
app.use(cors(corsOptions));
