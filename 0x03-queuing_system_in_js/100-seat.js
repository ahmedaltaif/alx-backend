import express from 'express'; // Import Express framework
import kue from 'kue'; // Import Kue for job queue management
import redis from 'redis'; // Import Redis library
import { promisify } from 'util'; // Import promisify utility to convert callback-based functions to promises

// utils =================================================

// Create a Redis client
const client = redis.createClient();
// Promisify the Redis get method for easier async/await handling
const getAsync = promisify(client.get).bind(client);
let reservationEnabled; // Variable to track reservation status

const seatsKey = 'available_seats'; // Redis key for available seats

// Function to reserve seats by setting the available seats count in Redis
function reserveSeat(number) {
  client.set(seatsKey, number); // Store the number of available seats in Redis
}

// Async function to get the current number of available seats
async function getCurrentAvailableSeats() {
  const availableSeats = await getAsync(seatsKey); // Retrieve the available seats from Redis
  return availableSeats; // Return the available seats
}

// Redis event listeners for error handling and successful connection
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

// Log when Redis client connects successfully
client.on('connect', () => {
  console.log('Redis client connected to the server');
  reserveSeat(50); // Initialize the available seats to 50
  reservationEnabled = true; // Enable reservations
});

// kue  =================================================

// Create a job queue using Kue
const queue = kue.createQueue();
const queueName = 'reserve_seat'; // Name of the job queue

// express  =================================================

// Create an Express application
const app = express();
const port = 1245; // Set the port for the server

// Start listening on the specified port
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

// Endpoint to get the current number of available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats(); // Get available seats from Redis
  res.json({ numberOfAvailableSeats: availableSeats }); // Respond with the number of available seats
});

// Endpoint to reserve a seat
app.get('/reserve_seat', (req, res) => {
  // Check if reservations are enabled
  if (reservationEnabled === false) {
    res.json({ status: 'Reservations are blocked' }); // Respond with blocked status if reservations are not allowed
    return;
  }

  const jobFormat = {}; // Job format (can include additional details if needed)

  // Create a job for reserving a seat
  const job = queue.create(queueName, jobFormat).save((err) => {
    if (err) {
      res.json({ status: 'Reservation failed' }); // Respond with failure status if job creation fails
    } else {
      res.json({ status: 'Reservation in process' }); // Respond with process status if job is created successfully
    }
  });

  // Event listener for job completion
  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`); // Log when the reservation job completes
  });

  // Event listener for job failure
  job.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`); // Log when the reservation job fails
  });
});

// Endpoint to process the reservation jobs in the queue
app.get('/process', async (req, res) => {
  // Process jobs in the reservation queue
  queue.process(queueName, async (job, done) => {
    let availableSeats = await getCurrentAvailableSeats(); // Get current available seats

    if (availableSeats <= 0) {
      done(Error('Not enough seats available')); // Complete the job with an error if no seats are available
    }

    availableSeats = Number(availableSeats) - 1; // Decrement available seats

    reserveSeat(availableSeats); // Update the reserved seats in Redis

    if (availableSeats <= 0) {
      reservationEnabled = false; // Disable reservations if no seats are left
    }

    done(); // Mark the job as completed
  });
  res.json({ status: 'Queue processing' }); // Respond with status indicating queue processing started
});
