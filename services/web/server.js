// server.js

import http from 'http';
import nextConfig from './next.config.mjs';

// Access public runtime config
const { publicRuntimeConfig } = nextConfig;

// Define the health check endpoint
const handleRequest = (request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not Found');
  }
};

// Create the server and start listening
const server = http.createServer(handleRequest);
const port = publicRuntimeConfig.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
