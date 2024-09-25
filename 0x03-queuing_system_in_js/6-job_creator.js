// Import the Kue library to manage job queues
import kue from 'kue';

// Create a queue using Kue
const queue = kue.createQueue();

// Define the job format with necessary data (phone number and message)
const jobFormat = {
  phoneNumber: '4153518780', // The phone number to send the notification
  message: 'This is the code to verify your account', // The message content
};

// Define the queue name where the job will be pushed
const queueName = 'push_notification_code';

// Create a new job in the queue with the jobFormat object
const job = queue.create(queueName, jobFormat).save((err) => {
  // If there is no error, log that the job was successfully created with its job ID
  if (!err) console.log(`Notification job created: ${job.id}`);
});

// Event listener for when the job completes successfully
job.on('complete', () => {
  console.log('Notification job completed');
});

// Event listener for when the job fails
job.on('failed', () => {
  console.log('Notification job failed');
});
