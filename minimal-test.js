// Minimal test server to verify port availability
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Create a simple HTML page
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AstroGuide Pro - Test Server</title>
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
        .success {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
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
    </style>
</head>
<body>
    <h1>AstroGuide Pro - Test Server</h1>
    
    <div class="success">
        <h2>✅ Server Running Successfully!</h2>
        <p>This confirms that port 3000 is available and working correctly.</p>
    </div>
    
    <div class="info">
        <h2>System Information</h2>
        <pre id="sysinfo">Loading system information...</pre>
    </div>
    
    <script>
        // Display some basic system information
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
    </script>
</body>
</html>
`;

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
});

// Start the server
server.listen(PORT, () => {
    console.log(`
============================================
✅ Test server running at http://localhost:${PORT}
============================================
Time: ${new Date().toISOString()}
Node version: ${process.version}
Platform: ${process.platform}
============================================
`);
});
