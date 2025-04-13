
const db = require('./config/db');
const initializeDatabase = require('./config/init-db');

// Run the initialization function
(async function() {
  try {
    await initializeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();
