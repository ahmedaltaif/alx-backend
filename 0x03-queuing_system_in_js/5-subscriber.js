// Import the redis module
import redis from 'redis';

// Create a new Redis client to act as the subscriber
const subscriber = redis.createClient();

// Event listener for 'error' event - handles connection errors
subscriber.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

// Event listener for 'connect' event - logs successful connection
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Define the Redis channel name to subscribe to
const CHANNEL = 'holberton school channel';

// Subscribe to the specified Redis channel
subscriber.subscribe(CHANNEL);

// Event listener for receiving messages on the subscribed channel
subscriber.on('message', (channel, message) => {
  // Check if the message is from the correct channel
  if (channel === CHANNEL) {
    // Log the message received
    console.log(message);
  }

  // If the message is 'KILL_SERVER', unsubscribe from the channel and quit the client
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe(CHANNEL); // Unsubscribe from the channel
    subscriber.quit(); // Close the Redis connection
  }
});
