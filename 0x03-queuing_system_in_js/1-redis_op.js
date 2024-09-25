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

// Function to set a new key-value pair in Redis
function setNewSchool(schoolName, value) {
  // Using the Redis SET command to store the value with the provided key (schoolName)
  // redis.print logs the result of the SET operation (either success or error)
  client.set(schoolName, value, redis.print);
}

// Function to retrieve the value of a key from Redis
function displaySchoolValue(schoolName) {
  // Using the Redis GET command to fetch the value for the provided key (schoolName)
  client.get(schoolName, (err, res) => {
    // If no error, it logs the result (value associated with the key)
    console.log(res);
  });
}

// Display the value for the key 'Holberton' (if it exists in Redis)
displaySchoolValue('Holberton');

// Set a new key-value pair in Redis: 'HolbertonSanFrancisco' with a value of '100'
setNewSchool('HolbertonSanFrancisco', '100');

// Display the value for the key 'HolbertonSanFrancisco' to verify it was set correctly
displaySchoolValue('HolbertonSanFrancisco');
