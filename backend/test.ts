import { getAllUsers } from './models/User';

async function runTest() {
  console.log('--- Starting Database Test ---');
  try {
    const users = await getAllUsers();
    console.log('Final Result:', users);
  } catch (err) {
    console.error('Test script caught error:', err);
  } finally {
    console.log('Test logic finished. Closing process.');
    process.exit();
  }
}

runTest();