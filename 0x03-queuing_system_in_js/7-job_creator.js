// Import the Kue library to manage job queues
import kue from 'kue';

// Define an array of job objects containing phone numbers and messages
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

// Create a new Kue queue instance
const queue = kue.createQueue();

// Define the name of the queue for push notifications
const queueName = 'push_notification_code_2';

// Iterate over each job in the jobs array
jobs.forEach((jobFormat) => {
  // Create a new job in the queue with the job format data
  const job = queue.create(queueName, jobFormat).save((err) => {
    // If no error, log the job creation with its job ID
    if (!err) console.log(`Notification job created: ${job.id}`);
  });

  // Event listener for when the job completes successfully
  job.on('complete', () => {
    console.log(`Notification job ${job.id} completed`);
  });

  // Event listener for when the job fails
  job.on('failed', (errorMessage) => {
    console.log(`Notification job ${job.id} failed: ${errorMessage}`);
  });

  // Event listener for job progress updates
  job.on('progress', (progress) => {
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });
});
