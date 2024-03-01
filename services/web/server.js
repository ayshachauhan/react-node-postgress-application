const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const { serverRuntimeConfig } = require('./next.config.js');

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(bodyParser.json());

  // Health Endpoint
  server.get('/health', (req, res) => {
    res.status(200).json({ message: 'ok' });
  });

  // Next.js request handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start server

  const PORT = serverRuntimeConfig.PORT || 3000;
  console.log(serverRuntimeConfig.PORT);
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server ready on http://localhost:${PORT}`);
  });
});
