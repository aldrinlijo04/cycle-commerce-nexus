const db = require('../config/db');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.category_id,
      measurementUnit: product.measurement_unit,
      category: product.category_name ? {
        id: product.category_id,
        name: product.category_name,
        description: product.category_description
      } : undefined
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.category_id,
      measurementUnit: product.measurement_unit,
      category: product.category_name ? {
        id: product.category_id,
        name: product.category_name,
        description: product.category_description
      } : undefined
    };
    
    res.json(formattedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
    `, [categoryId]);
    
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.category_id,
      measurementUnit: product.measurement_unit,
      category: product.category_name ? {
        id: product.category_id,
        name: product.category_name,
        description: product.category_description
      } : undefined
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, categoryId, measurementUnit } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO products (name, description, category_id, measurement_unit) VALUES (?, ?, ?, ?)',
      [name, description, categoryId, measurementUnit]
    );
    
    // Get the newly created product with category details
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [result.insertId]);
    
    if (products.length === 0) {
      return res.status(500).json({ message: 'Error retrieving created product' });
    }
    
    const product = products[0];
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.category_id,
      measurementUnit: product.measurement_unit,
      category: product.category_name ? {
        id: product.category_id,
        name: product.category_name,
        description: product.category_description
      } : undefined
    };
    
    res.status(201).json(formattedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
