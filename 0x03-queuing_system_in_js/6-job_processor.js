// Import the Kue library to manage job queues
import kue from 'kue';

// Create a queue using Kue
const queue = kue.createQueue();

// Function to simulate sending a notification
function sendNotification(phoneNumber, message) {
  // Log the action of sending a notification with the given phone number and message
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
}

// Define the name of the queue where notification jobs will be processed
const queueName = 'push_notification_code';

// Process jobs in the specified queue
queue.process(queueName, (job, done) => {
  // Destructure the job data to extract phoneNumber and message
  const { phoneNumber, message } = job.data;
  
  // Call the function to send the notification
  sendNotification(phoneNumber, message);
  
  // Mark the job as done after processing
  done();
});
