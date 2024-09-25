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

// Define the Redis hash key
const KEY = 'HolbertonSchools';

// Define an array of city names (keys) for the Redis hash
const keys = ['Portland', 'Seattle', 'New York', 'Bogota', 'Cali', 'Paris'];

// Define an array of corresponding values (school sizes or other data) for each city
const values = [50, 80, 20, 20, 40, 2];

// Use forEach to iterate over each city and its corresponding value
keys.forEach((key, index) => {
  // Add each city-value pair to the Redis hash using the HSET command
  // redis.print logs the result of each HSET operation (success or error)
  client.hset(KEY, key, values[index], redis.print);
});

// Retrieve all key-value pairs from the Redis hash using HGETALL
client.hgetall(KEY, (err, value) => {
  if (err) {
    console.error(`Error fetching data: ${err.message}`);
  } else {
    // Log the entire hash as an object, where each city is a key and its corresponding value is the value
    console.log(value);
  }
});
