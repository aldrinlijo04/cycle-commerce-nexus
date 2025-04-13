
const db = require('../config/db');

// Get all demands
exports.getDemands = async (req, res) => {
  try {
    const [demands] = await db.query(`
      SELECT d.*, 
             p.id as product_id, p.name as product_name, p.description as product_description, 
             p.measurement_unit, p.category_id,
             c.name as category_name, c.description as category_description
      FROM demands d
      JOIN products p ON d.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    
    const formattedDemands = demands.map(demand => ({
      id: demand.id,
      productId: demand.product_id,
      quantity: parseFloat(demand.quantity),
      maxPrice: parseFloat(demand.max_price),
      location: demand.location,
      active: Boolean(demand.active),
      createdBy: demand.created_by,
      createdAt: demand.created_at,
      product: {
        id: demand.product_id,
        name: demand.product_name,
        description: demand.product_description,
        categoryId: demand.category_id,
        measurementUnit: demand.measurement_unit,
        category: demand.category_name ? {
          id: demand.category_id,
          name: demand.category_name,
          description: demand.category_description
        } : undefined
      }
    }));
    
    res.json(formattedDemands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new demand
exports.createDemand = async (req, res) => {
  try {
    const { productId, quantity, maxPrice, location, active, createdBy } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO demands (product_id, quantity, max_price, location, active, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, quantity, maxPrice, location, active, createdBy]
    );
    
    // Get the newly created demand with product details
    const [demands] = await db.query(`
      SELECT d.*, 
             p.id as product_id, p.name as product_name, p.description as product_description, 
             p.measurement_unit, p.category_id,
             c.name as category_name, c.description as category_description
      FROM demands d
      JOIN products p ON d.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE d.id = ?
    `, [result.insertId]);
    
    if (demands.length === 0) {
      return res.status(500).json({ message: 'Error retrieving created demand' });
    }
    
    const demand = demands[0];
    const formattedDemand = {
      id: demand.id,
      productId: demand.product_id,
      quantity: parseFloat(demand.quantity),
      maxPrice: parseFloat(demand.max_price),
      location: demand.location,
      active: Boolean(demand.active),
      createdBy: demand.created_by,
      createdAt: demand.created_at,
      product: {
        id: demand.product_id,
        name: demand.product_name,
        description: demand.product_description,
        categoryId: demand.category_id,
        measurementUnit: demand.measurement_unit,
        category: demand.category_name ? {
          id: demand.category_id,
          name: demand.category_name,
          description: demand.category_description
        } : undefined
      }
    };
    
    res.status(201).json(formattedDemand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
