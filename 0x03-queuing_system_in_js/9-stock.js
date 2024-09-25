import express from 'express'; // Import Express framework
import redis from 'redis'; // Import Redis library
import { promisify } from 'util'; // Import promisify utility to convert callback-based functions to promises

// utils =================================================

// List of available products
const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5,
  },
];

// Function to get an item by its ID
function getItemById(id) {
  return listProducts.filter((item) => item.itemId === id)[0];
}

// redis ==========================================

// Create a Redis client
const client = redis.createClient();
// Promisify the Redis get method for easier async/await handling
const getAsync = promisify(client.get).bind(client);

// Error handling for Redis client
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

// Log when Redis client connects successfully
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Function to reserve stock for an item by its ID
function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock); // Store the stock in Redis
}

// Async function to get the current reserved stock for an item by its ID
async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`); // Retrieve the stock from Redis
  return stock;
}

// express =============================================

// Create an Express application
const app = express();
const port = 1245; // Set the port for the server

const notFound = { status: 'Product not found' }; // Message for non-existent products

// Start listening on the specified port
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

// Endpoint to list all available products
app.get('/list_products', (req, res) => {
  res.json(listProducts); // Respond with the list of products in JSON format
});

// Endpoint to get details of a specific product by its ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId); // Convert itemId from string to number
  const item = getItemById(itemId); // Fetch the item by ID

  if (!item) {
    res.json(notFound); // Respond with not found message if the item does not exist
    return;
  }

  const currentStock = await getCurrentReservedStockById(itemId); // Get current reserved stock
  const stock =
    currentStock !== null ? currentStock : item.initialAvailableQuantity; // Determine current stock

  item.currentQuantity = stock; // Add current stock to item details
  res.json(item); // Respond with item details
});

// Endpoint to reserve a product by its ID
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId); // Convert itemId from string to number
  const item = getItemById(itemId); // Fetch the item by ID
  const noStock = { status: 'Not enough stock available', itemId }; // Message for insufficient stock
  const reservationConfirmed = { status: 'Reservation confirmed', itemId }; // Message for successful reservation

  if (!item) {
    res.json(notFound); // Respond with not found message if the item does not exist
    return;
  }

  let currentStock = await getCurrentReservedStockById(itemId); // Get current reserved stock
  if (currentStock === null) currentStock = item.initialAvailableQuantity; // Use initial stock if no reserved stock

  if (currentStock <= 0) {
    res.json(noStock); // Respond with no stock message if none is available
    return;
  }

  reserveStockById(itemId, Number(currentStock) - 1); // Reserve stock by decrementing current stock

  res.json(reservationConfirmed); // Respond with reservation confirmed message
});
