import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import compression from 'compression';
import { v4 as uuid } from 'uuid';
import { initPassport } from './authentication';
import routes from './routes';

import models from './models';
import schema from './schema';
import resolvers from './resolvers';
import { createApolloServer } from './apollo-server';
import { logger } from './utils/logger';
import { httpLogger } from './utils/httpLogger';

const MongoStore = connectMongo(expressSession);
export const session = expressSession({
  genid: (req) => uuid(),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }, // 1 year
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
});

// Connect to database
mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// Initializes passport
initPassport();
// Initializes application
const app = express();

// Enable gzip compression
app.use(compression());
// http logging
app.use(httpLogger);
// Enable cors
app.use(cors({
  origin: [
    process.env.FRONTEND_URL_1,
    process.env.FRONTEND_URL_2,
  ],
  credentials: true,
}));
// Enable session
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
// Auth routes
app.use(routes);

// Server static files
const CLIENT_BUILD_DIR = path.resolve(__dirname, '../../client/build'); 
app.use(express.static(CLIENT_BUILD_DIR));
// Redirect all of server requests to /index.html
// @see https://ui.dev/react-router-cannot-get-url-refresh/
app.get('*', (req, res) => {
  res.sendFile(path.resolve(CLIENT_BUILD_DIR, 'index.html'));
});

// Create a Apollo Server
const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app, path: '/graphql', cors: false });

// Create http server and add subscriptions to it
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// Listen to HTTP and WebSocket server
const PORT = process.env.PORT || process.env.API_PORT;
httpServer.listen({ port: PORT }, () => {
  logger.info(`Server listening on port ${PORT}`);
});