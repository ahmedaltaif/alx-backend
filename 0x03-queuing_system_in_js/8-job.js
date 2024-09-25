// Function to create push notification jobs
function createPushNotificationsJobs(jobs, queue) {
  // Validate that the jobs parameter is an array
  if (!Array.isArray(jobs)) throw Error('Jobs is not an array');

  // Define the name of the queue for push notifications
  const queueName = 'push_notification_code_3';

  // Iterate over each job format in the jobs array
  jobs.forEach((jobFormat) => {
    // Create a new job in the queue using the specified job format
    const job = queue.create(queueName, jobFormat);

    // Save the job to the queue
    job.save((err) => {
      if (!err) console.log(`Notification job created: ${job.id}`);
    });

    // Set up an event listener for when the job completes
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    // Set up an event listener for when the job fails
    job.on('failed', (errorMessage) => {
      console.log(`Notification job ${job.id} failed: ${errorMessage}`);
    });

    // Set up an event listener for job progress updates
    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
}

// Export the function for use in other modules
export default createPushNotificationsJobs;
