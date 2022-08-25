import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors, { CorsRequest } from "cors";
import bodyParser from "body-parser";
import gql from "graphql-tag";
import { createServer, Server } from "http";
import { config } from "dotenv";
import { welcome } from "./api/welcome";

config();
const port = process.env.PORT || 4000;
const app = express();
const httpServer = createServer(app);

interface MyContext {}

const apolloServer = new ApolloServer<MyContext>({
  typeDefs: gql`
    type Tes {
      name: String
    }
    type Query {
      getTes: Tes
    }
  `,
  resolvers: {
    Query: {
      getTes: () => {
        return {
          name: "tes",
        };
      },
    },
  },
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

app.get("/", welcome);

async function start() {
  /* load apollo server */
  await apolloServer.start();

  /* add apollo middleware */
  app.use(
    "/graphql",
    bodyParser.json(),
    cors<CorsRequest>(),
    expressMiddleware(apolloServer, {
      context: async (context) => {
        return {
          ...context,
        };
      },
    })
  );

  const run = await new Promise<Server>((resolve) =>
    httpServer.listen(port, () => resolve.call(null, httpServer))
  );
  return () =>
    new Promise((res) =>
      run.close(() => {
        console.log("server has been closed");

        res(null);
      })
    );
}

await start();
console.log(`server run on port 4000`);
