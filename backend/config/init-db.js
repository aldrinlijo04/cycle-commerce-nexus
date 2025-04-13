
const db = require('./db');

async function initializeDatabase() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        company_name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'company') NOT NULL DEFAULT 'company',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create categories table
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);

    // Create products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT,
        measurement_unit VARCHAR(50) NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    // Create supplies table
    await db.query(`
      CREATE TABLE IF NOT EXISTS supplies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        available BOOLEAN DEFAULT TRUE,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create demands table
    await db.query(`
      CREATE TABLE IF NOT EXISTS demands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        max_price DECIMAL(10,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create exchanges table
    await db.query(`
      CREATE TABLE IF NOT EXISTS exchanges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        supply_id INT NOT NULL,
        demand_id INT NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supply_id) REFERENCES supplies(id) ON DELETE CASCADE,
        FOREIGN KEY (demand_id) REFERENCES demands(id) ON DELETE CASCADE
      )
    `);

    // Insert sample data
    // Insert sample users
    await db.query(`
      INSERT IGNORE INTO users (username, password, email, company_name, role)
      VALUES 
        ('admin', '$2b$10$PxqQvH9rIgZD0Cq.bZ1qzOlozxPd85CAPL2.eYGJOWEqQdXJJn8XC', 'admin@example.com', 'System Admin', 'admin'),
        ('company', '$2b$10$PxqQvH9rIgZD0Cq.bZ1qzOlozxPd85CAPL2.eYGJOWEqQdXJJn8XC', 'company@example.com', 'Demo Company', 'company')
    `);
    
    // Insert sample categories
    await db.query(`
      INSERT IGNORE INTO categories (id, name, description)
      VALUES 
        (1, 'Plastics', 'Various plastic materials and byproducts'),
        (2, 'Metals', 'Metal scraps and byproducts'),
        (3, 'Chemicals', 'Chemical substances and compounds'),
        (4, 'Paper', 'Paper waste and byproducts'),
        (5, 'Textiles', 'Textile waste and byproducts')
    `);

    // Insert sample products
    await db.query(`
      INSERT IGNORE INTO products (id, name, description, category_id, measurement_unit)
      VALUES 
        (1, 'PET Scraps', 'Polyethylene terephthalate scraps', 1, 'kg'),
        (2, 'HDPE Waste', 'High-density polyethylene waste', 1, 'kg'),
        (3, 'Steel Shavings', 'Steel manufacturing shavings', 2, 'kg'),
        (4, 'Aluminum Scrap', 'Recyclable aluminum scrap', 2, 'kg'),
        (5, 'Acetic Acid', 'Surplus acetic acid', 3, 'L'),
        (6, 'Cardboard', 'Used cardboard packaging', 4, 'kg'),
        (7, 'Cotton Waste', 'Cotton textile waste', 5, 'kg')
    `);

    // Insert sample supplies
    await db.query(`
      INSERT IGNORE INTO supplies (id, product_id, quantity, price, location, available, created_by, created_at)
      VALUES 
        (1, 1, 500, 0.75, 'Chicago, IL', TRUE, 2, '2023-04-01 10:00:00'),
        (2, 3, 1000, 1.25, 'Detroit, MI', TRUE, 2, '2023-04-05 14:30:00'),
        (3, 6, 750, 0.30, 'Indianapolis, IN', TRUE, 2, '2023-04-10 09:15:00')
    `);

    // Insert sample demands
    await db.query(`
      INSERT IGNORE INTO demands (id, product_id, quantity, max_price, location, active, created_by, created_at)
      VALUES 
        (1, 1, 200, 1.00, 'Cincinnati, OH', TRUE, 2, '2023-04-02 11:20:00'),
        (2, 2, 300, 0.80, 'Columbus, OH', TRUE, 2, '2023-04-07 16:45:00'),
        (3, 7, 150, 0.50, 'Louisville, KY', TRUE, 2, '2023-04-12 13:10:00')
    `);

    // Insert sample exchanges
    await db.query(`
      INSERT IGNORE INTO exchanges (id, supply_id, demand_id, quantity, price, status, created_at)
      VALUES 
        (1, 1, 1, 200, 0.85, 'completed', '2023-04-15 10:30:00')
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Export the initialization function
module.exports = initializeDatabase;
