// Import the redis module
import redis from 'redis';

// Create a new Redis client to act as the publisher
const publisher = redis.createClient();

// Event listener for 'error' event - handles connection errors
publisher.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

// Event listener for 'connect' event - logs successful connection
publisher.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Define the Redis channel name for publishing messages
const CHANNEL = 'holberton school channel';

// Function to publish a message to the Redis channel after a specified time (in milliseconds)
function publishMessage(message, time) {
  // Use setTimeout to delay the message publishing by the specified time
  setTimeout(() => {
    console.log(`About to send ${message}`);
    // Publish the message to the Redis channel
    publisher.publish(CHANNEL, message);
  }, time);
}

// Publish messages to the channel with different delays
publishMessage('Holberton Student #1 starts course', 100); // Sent after 100ms
publishMessage('Holberton Student #2 starts course', 200); // Sent after 200ms
publishMessage('KILL_SERVER', 300); // Sent after 300ms (signal to terminate)
publishMessage('Holberton Student #3 starts course', 400); // Sent after 400ms
