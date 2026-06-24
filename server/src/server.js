// Process entry point: connect to MongoDB, then start the HTTP server.
const config = require('./config/env');
const connectDB = require('./config/db');
const { seedDefaultAdmin } = require('./config/seed');
const app = require('./app');

async function start() {
  try {
    await connectDB();
    await seedDefaultAdmin();

    const server = app.listen(config.port, () => {
      console.log(`[server] Spatium API listening on port ${config.port} (${config.nodeEnv})`);
    });

    // Handle listen-time errors (e.g. port already in use) with a clear message
    // instead of an unhandled 'error' event crashing the process with a stack.
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `[server] Port ${config.port} is already in use. ` +
            `Stop the other process (e.g. lsof -ti:${config.port} | xargs kill) or set a different PORT in .env.`
        );
      } else {
        console.error('[server] HTTP server error:', err.message);
      }
      process.exit(1);
    });

    // Graceful shutdown.
    const shutdown = (signal) => {
      console.log(`\n[server] ${signal} received, shutting down...`);
      server.close(() => {
        console.log('[server] HTTP server closed');
        process.exit(0);
      });
    };
    ['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    process.exit(1);
  }
}

// Last-resort safety nets so a stray rejection/exception is logged rather than
// silently (or loudly) killing the API. Request-level errors are already
// funnelled through the async handler + error middleware and never reach here.
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err);
});

start();
