// Express application wiring: security middleware, sessions, CORS, routes and
// error handling. Kept separate from server.js so it can be imported in tests.
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const config = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const pageRoutes = require('./routes/pages');
const makeContentRouter = require('./routes/contentRouter');

const News = require('./models/News');
const Project = require('./models/Project');
const Gallery = require('./models/Gallery');

const app = express();

// Behind a reverse proxy (e.g. nginx) so secure cookies work in production.
if (config.isProduction) {
  app.set('trust proxy', 1);
}

// --- Security & parsing ---------------------------------------------------
app.use(helmet());
app.use(compression()); // gzip responses (large HTML page content benefits most)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (!config.isProduction) {
  app.use(morgan('dev'));
}

// --- CORS -----------------------------------------------------------------
// Allow the configured client origin(s); support a comma-separated list.
const allowedOrigins = config.clientUrl.split(',').map((o) => o.trim());
// Always allow local dev origins (the user's own machine) so the Vite dev
// server works without editing the production CLIENT_URL.
const localOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, server-to-server) with no Origin.
      if (!origin || allowedOrigins.includes(origin) || localOriginRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// --- Sessions (stored in MongoDB) ----------------------------------------
app.use(
  session({
    name: 'spatium.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.mongoUri,
      ttl: 60 * 60 * 24 * 7, // 7 days
      touchAfter: 24 * 3600, // only rewrite session once/day unless changed
    }),
    cookie: {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// --- Health check ---------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

// --- API routes -----------------------------------------------------------
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRoutes);
app.use('/pages', pageRoutes);
app.use('/news', makeContentRouter(News));
app.use('/projects', makeContentRouter(Project));
app.use('/gallery', makeContentRouter(Gallery));

// --- Fallbacks ------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
