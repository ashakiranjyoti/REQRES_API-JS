// utils/logger.js
// Small, readable logger to keep console output consistent across tests.

class Logger {
  info(message, ...args) {
    console.log(`[INFO] ${message}`, ...args);
  }

  warn(message, ...args) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  }

  step(message, ...args) {
    console.log(`\n=== ${message} ===`, ...args);
  }
}

module.exports = new Logger();

