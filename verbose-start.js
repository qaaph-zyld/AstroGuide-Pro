// Verbose startup script with detailed logging
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('=== AstroGuide Pro Verbose Startup ===');
console.log(`Current directory: ${process.cwd()}`);
console.log(`Node version: ${process.version}`);
console.log('Environment variables:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// Set environment variables
process.env.NODE_OPTIONS = '--openssl-legacy-provider';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.BROWSER = 'none'; // Prevent auto-opening browser

console.log('Setting environment variables:');
console.log(`- NODE_OPTIONS: ${process.env.NODE_OPTIONS}`);
console.log(`- SKIP_PREFLIGHT_CHECK: ${process.env.SKIP_PREFLIGHT_CHECK}`);
console.log(`- TSC_COMPILE_ON_ERROR: ${process.env.TSC_COMPILE_ON_ERROR}`);
console.log(`- BROWSER: ${process.env.BROWSER}`);

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json found');
  try {
    const packageJson = require(packageJsonPath);
    console.log(`Project name: ${packageJson.name}`);
    console.log(`React-scripts version: ${packageJson.dependencies['react-scripts']}`);
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
  }
} else {
  console.error('❌ package.json not found');
}

// Determine the correct path to react-scripts based on platform
let reactScriptsPath;
if (process.platform === 'win32') {
  reactScriptsPath = path.join(process.cwd(), 'node_modules', '.bin', 'react-scripts.cmd');
} else {
  reactScriptsPath = path.join(process.cwd(), 'node_modules', '.bin', 'react-scripts');
}

// Check if react-scripts exists
if (fs.existsSync(reactScriptsPath)) {
  console.log(`✅ react-scripts found at: ${reactScriptsPath}`);
} else {
  console.error(`❌ react-scripts not found at: ${reactScriptsPath}`);
  console.log('Searching for react-scripts in node_modules...');
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const binPath = path.join(nodeModulesPath, '.bin');
    if (fs.existsSync(binPath)) {
      try {
        const files = fs.readdirSync(binPath);
        console.log('Files in .bin directory:', files);
      } catch (error) {
        console.error('Error reading .bin directory:', error.message);
      }
    } else {
      console.error('❌ .bin directory not found');
    }
  } else {
    console.error('❌ node_modules directory not found');
  }
}

console.log('\nStarting React application...');

// Start the application using react-scripts
const startProcess = spawn(
  'npm',
  ['run', 'start:win'],
  { 
    stdio: 'pipe',
    env: process.env,
    shell: true
  }
);

// Handle process output
startProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[STDOUT] ${output}`);
  
  // Look for the "Compiled successfully!" message
  if (output.includes('Compiled successfully!')) {
    console.log('\n✅ APPLICATION STARTED SUCCESSFULLY!');
    console.log('You can now access the application at: http://localhost:3000\n');
  }
});

startProcess.stderr.on('data', (data) => {
  console.error(`[STDERR] ${data.toString()}`);
});

startProcess.on('error', (err) => {
  console.error('❌ Failed to start the application:', err.message);
});

startProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Application process exited successfully');
  } else {
    console.error(`❌ Application process exited with code ${code}`);
  }
});
