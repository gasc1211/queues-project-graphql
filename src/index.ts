import cors from "cors";
import http from "http";
import Express, { json, Application, NextFunction } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authMiddleware } from "./middleware.js";

import { typeDefs } from './typedefs.js';
import { resolvers } from "./resolvers/index.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

const app: Application = Express();
const httpServer = http.createServer(app);

// Apply custom auth middleware
app.use(authMiddleware);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

// Start ApolloServer
await server.start();

//
app.use(
  '/graphql',
  cors<cors.CorsRequest>({
    origin: process.env.UI_URL,
    credentials: true
  }),
  json(),
  expressMiddleware(server),
);
// Modified server startup
await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve),
);

console.log(`🚀 Server ready at http://localhost:4000/`);