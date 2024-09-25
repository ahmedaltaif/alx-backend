import createPushNotificationsJobs from './8-job'; // Import the function to test
import kue from 'kue'; // Import the Kue library for job queue
import { expect } from 'chai'; // Import Chai for assertions

const queue = kue.createQueue(); // Create a new Kue queue

// Define sample jobs for testing
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account',
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account',
  },
];

describe('createPushNotificationsJobs', () => {
  // Hook to enter test mode before running tests
  before(function () {
    queue.testMode.enter();
  });

  // Hook to clear jobs in the queue after each test
  afterEach(function () {
    queue.testMode.clear();
  });

  // Hook to exit test mode after all tests
  after(function () {
    queue.testMode.exit();
  });

  // Test for handling non-array input (Number)
  it('should display an error message if jobs is not an array passing Number', () => {
    expect(() => {
      createPushNotificationsJobs(2, queue); // Attempt to create jobs with a number
    }).to.throw('Jobs is not an array'); // Expect an error to be thrown
  });

  // Test for handling non-array input (Object)
  it('should display an error message if jobs is not an array passing Object', () => {
    expect(() => {
      createPushNotificationsJobs({}, queue); // Attempt to create jobs with an object
    }).to.throw('Jobs is not an array'); // Expect an error to be thrown
  });

  // Test for handling non-array input (String)
  it('should display an error message if jobs is not an array passing String', () => {
    expect(() => {
      createPushNotificationsJobs('Hello', queue); // Attempt to create jobs with a string
    }).to.throw('Jobs is not an array'); // Expect an error to be thrown
  });

  // Test for handling an empty array
  it('should NOT display an error message if jobs is an array with an empty array', () => {
    const ret = createPushNotificationsJobs([], queue); // Create jobs with an empty array
    expect(ret).to.equal(undefined); // Expect no error
  });

  // Test for creating jobs in the queue
  it('should create two new jobs to the queue', () => {
    createPushNotificationsJobs(jobs, queue); // Create jobs with valid data
    expect(queue.testMode.jobs.length).to.equal(2); // Expect two jobs to be created

    // Check the first job's type and data
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.eql({
      phoneNumber: '4153518780',
      message: 'This is the code 1234 to verify your account',
    });

    // Check the second job's type and data
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).to.eql({
      phoneNumber: '4153118782',
      message: 'This is the code 4321 to verify your account',
    });
  });
});
