import dotenv from 'dotenv';
dotenv.config(); // Configure Environment variable
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import compression from 'compression';

import schema from './schema';
import models from './models';
import resolvers from './resolvers';
import { createApolloServer } from './utils/apollo-server';
import { logger } from './utils/logger';
import { httpLogger } from './utils/httpLogger';

// Connect to database
mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err));

// Initializes application
const app = express();

// Enable gzip compression
app.use(compression());

// http logging
app.use(httpLogger);
// if (process.env.NODE_ENV === 'production') {
//   const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });
//   app.use(morgan('combined', { stream: accessLogStream }));
// } else {
//   app.use(morgan('dev'));
// }

// Enable cors
const corsOptions = {
  origin: [process.env.APOLLO_STUDIO_URL, process.env.FRONTEND_URL_1, process.env.FRONTEND_URL_2],
  credentials: true,
};
app.use(cors(corsOptions));

// Server static files
app.use(express.static(path.resolve(__dirname, '../../client', 'build')));

// Redirect all of server requests to /index.html
// @see https://ui.dev/react-router-cannot-get-url-refresh/
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});

// Create a Apollo Server
const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app, path: '/graphql' });

// Create http server and add subscriptions to it
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// Listen to HTTP and WebSocket server
httpServer.listen({ port: process.env.API_PORT }, () => {
  logger.info(`Server listening on port ${process.env.API_PORT}`);
});
