// Import the Kue library to manage job queues
import kue from 'kue';

// Define an array of blacklisted phone numbers
const blacklistedNum = ['4153518780', '4153518781'];

// Function to send a notification
function sendNotification(phoneNumber, message, job, done) {
  const total = 100; // Total progress value

  // Start the job progress at 0
  job.progress(0, total);

  // Check if the phone number is blacklisted
  if (blacklistedNum.includes(phoneNumber)) {
    // If blacklisted, call done with an error
    done(Error(`Phone number ${phoneNumber} is blacklisted`));
    return; // Exit the function early
  }

  // Update the job progress to 50%
  job.progress(50, total);
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );

  // Call done to indicate that the job has finished successfully
  done();
}

// Create a new Kue queue instance
const queue = kue.createQueue();

// Define the name of the queue for push notifications
const queueName = 'push_notification_code_2';

// Process jobs in the specified queue
// The second argument (2) allows for concurrent processing of jobs
queue.process(queueName, 2, (job, done) => {
  const { phoneNumber, message } = job.data; // Destructure the job data
  sendNotification(phoneNumber, message, job, done); // Call the notification function
});
