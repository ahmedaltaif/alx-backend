// Import the Kue library to manage job queues
import kue from 'kue';

// Import the function to create push notifications jobs
import createPushNotificationsJobs from './8-job.js';

// Create a new Kue queue instance
const queue = kue.createQueue();

// Define a list of jobs with phone numbers and messages
const list = [
    {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account' // Message to send
    }
];

// Call the function to create push notification jobs with the list and queue
createPushNotificationsJobs(list, queue);
