
const db = require('../config/db');

// Get all exchanges
exports.getExchanges = async (req, res) => {
  try {
    // First get all exchanges
    const [exchanges] = await db.query(`
      SELECT e.*, 
             s.product_id as supply_product_id, s.quantity as supply_quantity, 
             s.price as supply_price, s.location as supply_location,
             d.product_id as demand_product_id, d.quantity as demand_quantity,
             d.max_price as demand_max_price, d.location as demand_location
      FROM exchanges e
      JOIN supplies s ON e.supply_id = s.id
      JOIN demands d ON e.demand_id = d.id
    `);
    
    // Format exchanges and include supply and demand details
    const formattedExchanges = await Promise.all(exchanges.map(async (exchange) => {
      // Get supply with product details
      const [supplies] = await db.query(`
        SELECT s.*, 
               p.id as product_id, p.name as product_name, p.description as product_description, 
               p.measurement_unit, p.category_id,
               c.name as category_name, c.description as category_description
        FROM supplies s
        JOIN products p ON s.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE s.id = ?
      `, [exchange.supply_id]);
      
      // Get demand with product details
      const [demands] = await db.query(`
        SELECT d.*, 
               p.id as product_id, p.name as product_name, p.description as product_description, 
               p.measurement_unit, p.category_id,
               c.name as category_name, c.description as category_description
        FROM demands d
        JOIN products p ON d.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE d.id = ?
      `, [exchange.demand_id]);
      
      const supply = supplies[0];
      const demand = demands[0];
      
      return {
        id: exchange.id,
        supplyId: exchange.supply_id,
        demandId: exchange.demand_id,
        quantity: parseFloat(exchange.quantity),
        price: parseFloat(exchange.price),
        status: exchange.status,
        createdAt: exchange.created_at,
        supply: {
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
        },
        demand: {
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
        }
      };
    }));
    
    res.json(formattedExchanges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new exchange
exports.createExchange = async (req, res) => {
  try {
    const { supplyId, demandId, quantity, price, status = 'pending' } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO exchanges (supply_id, demand_id, quantity, price, status) VALUES (?, ?, ?, ?, ?)',
      [supplyId, demandId, quantity, price, status]
    );
    
    // Get the newly created exchange with supply and demand details
    const [exchanges] = await db.query(`
      SELECT * FROM exchanges WHERE id = ?
    `, [result.insertId]);
    
    if (exchanges.length === 0) {
      return res.status(500).json({ message: 'Error retrieving created exchange' });
    }
    
    const exchange = exchanges[0];
    
    // Get supply with product details
    const [supplies] = await db.query(`
      SELECT s.*, 
             p.id as product_id, p.name as product_name, p.description as product_description, 
             p.measurement_unit, p.category_id,
             c.name as category_name, c.description as category_description
      FROM supplies s
      JOIN products p ON s.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE s.id = ?
    `, [exchange.supply_id]);
    
    // Get demand with product details
    const [demands] = await db.query(`
      SELECT d.*, 
             p.id as product_id, p.name as product_name, p.description as product_description, 
             p.measurement_unit, p.category_id,
             c.name as category_name, c.description as category_description
      FROM demands d
      JOIN products p ON d.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE d.id = ?
    `, [exchange.demand_id]);
    
    const supply = supplies[0];
    const demand = demands[0];
    
    const formattedExchange = {
      id: exchange.id,
      supplyId: exchange.supply_id,
      demandId: exchange.demand_id,
      quantity: parseFloat(exchange.quantity),
      price: parseFloat(exchange.price),
      status: exchange.status,
      createdAt: exchange.created_at,
      supply: {
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
      },
      demand: {
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
      }
    };
    
    res.status(201).json(formattedExchange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
