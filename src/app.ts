import express from 'express';
import cors from 'cors';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { config } from './config';

const MATCHMAKING_URL = config.MATCH_URL; 

const app = express();

app.use(cors());

const matchProxy = createProxyMiddleware({
  target: MATCHMAKING_URL,
  ws: true,
  on: {
    proxyReqWs: fixRequestBody,
  },
  changeOrigin: true,
  logger: console
});

const defineRoutes = () => {
  app.use('/match', matchProxy);

  app.use('/api', createProxyMiddleware({
    target: `${MATCHMAKING_URL}/api`,
    changeOrigin: true
  }))
}

const listen = () => {
  const server = app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  })
  server.on('upgrade', matchProxy.upgrade);
  return server;
}

defineRoutes();

export {
  app,
  listen
}
