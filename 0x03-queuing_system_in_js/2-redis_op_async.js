// Import the redis module and promisify utility from 'util' for handling asynchronous Redis methods
import redis from 'redis';
import { promisify } from 'util';

// Create a new Redis client
const client = redis.createClient();

// Promisify the 'get' method so that we can use async/await for Redis get operations
const getAsync = promisify(client.get).bind(client);

// Event listener for 'error' event - handles connection errors
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

// Event listener for 'connect' event - logs successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Function to set a new key-value pair in Redis
function setNewSchool(schoolName, value) {
  // Using the Redis SET command to store the value with the provided key (schoolName)
  // redis.print logs the result of the SET operation (either success or error)
  client.set(schoolName, value, redis.print);
}

// Asynchronous function to retrieve the value of a key from Redis using async/await
async function displaySchoolValue(schoolName) {
  try {
    // Await the result of the promisified Redis GET command
    const value = await getAsync(schoolName);
    // Log the value retrieved from Redis
    console.log(value);
  } catch (error) {
    // Log any errors that occur during the GET operation
    console.error(`Error fetching value for ${schoolName}:`, error);
  }
}

// Display the value for the key 'Holberton' (if it exists in Redis)
displaySchoolValue('Holberton');

// Set a new key-value pair in Redis: 'HolbertonSanFrancisco' with a value of '100'
setNewSchool('HolbertonSanFrancisco', '100');

// Display the value for the key 'HolbertonSanFrancisco' to verify it was set correctly
displaySchoolValue('HolbertonSanFrancisco');
