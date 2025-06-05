// Script to start the application with OpenSSL legacy provider
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting AstroGuide Pro with OpenSSL legacy provider...');

// Set environment variables for OpenSSL legacy provider
process.env.NODE_OPTIONS = '--openssl-legacy-provider';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.TSC_COMPILE_ON_ERROR = 'true';

try {
  // Use npm directly to run the start script
  console.log('Running npm start with OpenSSL legacy provider...');
  execSync('npm start', {
    stdio: 'inherit',
    env: process.env
  });
} catch (error) {
  console.error('Failed to start the application:', error.message);
  process.exit(1);
}
