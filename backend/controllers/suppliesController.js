
const db = require('../config/db');

// Get all supplies
exports.getSupplies = async (req, res) => {
  try {
    const [supplies] = await db.query(`
      SELECT s.*, 
             p.id as product_id, p.name as product_name, p.description as product_description, 
             p.measurement_unit, p.category_id,
             c.name as category_name, c.description as category_description
      FROM supplies s
      JOIN products p ON s.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    
    const formattedSupplies = supplies.map(supply => ({
      id: supply.id,
      productId: supply.product_id,
      quantity: parseFloat(supply.quantity),
      price: parseFloat(supply.price),
      location: supply.location,
      available: Boolean(supply.available),
      createdBy: supply.created_by,
      createdAt: supply.created_at,
      product: {
        id: supply.product_id,
        name: supply.product_name,
        description: supply.product_description,
        categoryId: supply.category_id,
        measurementUnit: supply.measurement_unit,
        category: supply.category_name ? {
          id: supply.category_id,
          name: supply.category_name,
          description: supply.category_description
        } : undefined
      }
    }));
    
    res.json(formattedSupplies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new supply
exports.createSupply = async (req, res) => {
  try {
    const { productId, quantity, price, location, available, createdBy } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO supplies (product_id, quantity, price, location, available, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, quantity, price, location, available, createdBy]
    );
    
    // Get the newly created supply with product details
    const [supplies] = await db.query(`
      SELECT s.*, 
             p.id as product_id, p.name as product_name, p.description as product_description, 
             p.measurement_unit, p.category_id,
             c.name as category_name, c.description as category_description
      FROM supplies s
      JOIN products p ON s.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE s.id = ?
    `, [result.insertId]);
    
    if (supplies.length === 0) {
      return res.status(500).json({ message: 'Error retrieving created supply' });
    }
    
    const supply = supplies[0];
    const formattedSupply = {
      id: supply.id,
      productId: supply.product_id,
      quantity: parseFloat(supply.quantity),
      price: parseFloat(supply.price),
      location: supply.location,
      available: Boolean(supply.available),
      createdBy: supply.created_by,
      createdAt: supply.created_at,
      product: {
        id: supply.product_id,
        name: supply.product_name,
        description: supply.product_description,
        categoryId: supply.category_id,
        measurementUnit: supply.measurement_unit,
        category: supply.category_name ? {
          id: supply.category_id,
          name: supply.category_name,
          description: supply.category_description
        } : undefined
      }
    };
    
    res.status(201).json(formattedSupply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
