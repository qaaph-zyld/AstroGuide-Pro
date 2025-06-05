// Direct start script for AstroGuide Pro
// This script bypasses dependency issues by directly starting a React development server
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

console.log('=== AstroGuide Pro Direct Startup ===');
console.log(`Current directory: ${process.cwd()}`);
console.log(`Node version: ${process.version}`);

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

// Check if port 3000 is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', () => {
      resolve(true);
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

// Start a simple HTTP server if React server fails
function startFallbackServer() {
  console.log('Starting fallback server on port 3000...');
  
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AstroGuide Pro - Diagnostic Mode</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
          }
          h1 {
              color: #4f46e5;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 10px;
          }
          .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin-bottom: 20px;
          }
          .info {
              background-color: #e0f2fe;
              border-left: 4px solid #0ea5e9;
              padding: 15px;
              margin-bottom: 20px;
          }
          pre {
              background-color: #f1f5f9;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
          }
          .button {
              background-color: #4f46e5;
              color: white;
              border: none;
              padding: 10px 15px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 10px;
          }
          .button:hover {
              background-color: #4338ca;
          }
      </style>
  </head>
  <body>
      <h1>AstroGuide Pro - Diagnostic Mode</h1>
      
      <div class="warning">
          <h2>⚠️ React Development Server Issue</h2>
          <p>The React development server could not be started. This diagnostic page is being served by a fallback server.</p>
      </div>
      
      <div class="info">
          <h2>System Information</h2>
          <pre id="sysinfo">Loading system information...</pre>
      </div>
      
      <div class="info">
          <h2>Recommended Actions</h2>
          <ol>
              <li>Check for dependency conflicts in package.json</li>
              <li>Ensure Node.js version is compatible (recommended: v16.x)</li>
              <li>Try running with the OpenSSL legacy provider: <code>NODE_OPTIONS=--openssl-legacy-provider npm start</code></li>
              <li>Clear npm cache: <code>npm cache clean --force</code></li>
              <li>Reinstall dependencies: <code>npm ci</code></li>
          </ol>
      </div>
      
      <button class="button" id="testButton">Run Browser Tests</button>
      <div id="testResults" style="margin-top: 20px;"></div>
      
      <script>
          // Display system information
          const sysinfo = document.getElementById('sysinfo');
          const info = {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
              language: navigator.language,
              cookiesEnabled: navigator.cookieEnabled,
              screenSize: \`\${window.screen.width}x\${window.screen.height}\`,
              windowSize: \`\${window.innerWidth}x\${window.innerHeight}\`,
              timestamp: new Date().toISOString()
          };
          
          sysinfo.textContent = JSON.stringify(info, null, 2);
          
          // Test button functionality
          document.getElementById('testButton').addEventListener('click', function() {
              const testResults = document.getElementById('testResults');
              testResults.innerHTML = '<h3>Running Tests...</h3>';
              
              // Test localStorage
              let localStorageTest = 'Failed';
              try {
                  localStorage.setItem('test', 'test');
                  if (localStorage.getItem('test') === 'test') {
                      localStorageTest = 'Passed';
                  }
                  localStorage.removeItem('test');
              } catch (e) {
                  localStorageTest = \`Failed: \${e.message}\`;
              }
              
              // Test fetch API
              fetch('https://jsonplaceholder.typicode.com/todos/1')
                  .then(response => response.json())
                  .then(data => {
                      testResults.innerHTML = \`
                          <h3>Test Results</h3>
                          <ul>
                              <li><strong>localStorage:</strong> \${localStorageTest}</li>
                              <li><strong>Fetch API:</strong> Passed</li>
                              <li><strong>JSON Parsing:</strong> Passed</li>
                          </ul>
                          <pre>\${JSON.stringify(data, null, 2)}</pre>
                      \`;
                  })
                  .catch(error => {
                      testResults.innerHTML = \`
                          <h3>Test Results</h3>
                          <ul>
                              <li><strong>localStorage:</strong> \${localStorageTest}</li>
                              <li><strong>Fetch API:</strong> Failed - \${error.message}</li>
                          </ul>
                      \`;
                  });
          });
      </script>
  </body>
  </html>
  `;
  
  const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  });
  
  server.listen(3000, () => {
    console.log(`
============================================
✅ Fallback server running at http://localhost:3000
============================================
Time: ${new Date().toISOString()}
Node version: ${process.version}
Platform: ${process.platform}
============================================
`);
  });
  
  server.on('error', (err) => {
    console.error(`Failed to start fallback server: ${err.message}`);
  });
}

// Main function
async function main() {
  // Check if port 3000 is already in use
  const portInUse = await isPortInUse(3000);
  if (portInUse) {
    console.log('Port 3000 is already in use. Please close any applications using this port and try again.');
    process.exit(1);
  }
  
  console.log('Port 3000 is available. Starting server...');
  
  // Try to start the React development server
  try {
    console.log('Attempting to start React development server...');
    
    // Use npx to run react-scripts directly
    const startProcess = spawn(
      'npx',
      ['react-scripts', 'start'],
      { 
        stdio: 'pipe',
        env: process.env,
        shell: true
      }
    );
    
    let serverStarted = false;
    
    // Handle process output
    startProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[STDOUT] ${output}`);
      
      // Look for the "Compiled successfully!" message
      if (output.includes('Compiled successfully!')) {
        serverStarted = true;
        console.log('\n✅ REACT APPLICATION STARTED SUCCESSFULLY!');
        console.log('You can now access the application at: http://localhost:3000\n');
      }
    });
    
    startProcess.stderr.on('data', (data) => {
      console.error(`[STDERR] ${data.toString()}`);
    });
    
    startProcess.on('error', (err) => {
      console.error('❌ Failed to start React application:', err.message);
      startFallbackServer();
    });
    
    startProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ React application process exited successfully');
      } else {
        console.error(`❌ React application process exited with code ${code}`);
        if (!serverStarted) {
          startFallbackServer();
        }
      }
    });
    
    // Set a timeout to start the fallback server if React server doesn't start
    setTimeout(() => {
      if (!serverStarted) {
        console.log('⚠️ React development server did not start within the timeout period.');
        startFallbackServer();
      }
    }, 30000); // 30 seconds timeout
  } catch (error) {
    console.error('❌ Failed to start React application:', error.message);
    startFallbackServer();
  }
}

// Run the main function
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  startFallbackServer();
});
