// Import the redis module
import redis from 'redis';

// Create a new Redis client
const client = redis.createClient();

// Event listener for 'error' event - handles connection errors
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

// Event listener for 'connect' event - logs successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});
