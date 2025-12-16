// Test setup to suppress console.log during tests
const originalConsoleLog = console.log;

beforeEach(() => {
  // Suppress console.log during tests
  console.log = () => {};
});

afterEach(() => {
  // Restore console.log after tests
  console.log = originalConsoleLog;
}); 
