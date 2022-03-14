import { makeSchema, fieldAuthorizePlugin } from "nexus";
import { join } from "path";
import * as  customtypes from "../models";
import * as types from "../graphql";
import { context, prisma } from "../modules/Context";
import { paljs } from '@paljs/nexus';
import { SECRET_KEY } from '../modules/Key';
import { parseToken } from '../modules/JWT';
import { User } from "@prisma/client";
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { graphqlUploadExpress } from "graphql-upload";

export const schema = makeSchema({

  types: [types, customtypes], // 1
  plugins: [paljs({
    excludeFields: ['password'],
  }), fieldAuthorizePlugin(),],
  outputs: {
    typegen: join(__dirname, "../../", "nexus-typegen.ts"), // 2

    schema: join(__dirname, "../..", "schema.graphql"), // 3

  },

  contextType: {                                    // 1

    module: join(__dirname, "../modules/Context.ts"),        // 2

    export: "Context",
    // 3

  },

});





async function startApolloServer() {
  const app = express();
  app.use(graphqlUploadExpress());
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    //@ts-ignore
    schema,
    // formatError: (e) => {
    // return e;
    // },
    context: async ({ req }) => {
      // Get the user token from the headers.
      const token = req.headers.authorization || "";

      if (!token) return context;

      // Try to retrieve a user with the token
      const user = (await parseToken<User>(token))

      return {
        user,
        isLogged: !!user,
        isAdmin: user?.isAdmin || false,
        gotKey: req.headers.authorization == SECRET_KEY,
        ...context,
      };
    },

    plugins: [{
      // Fires whenever a GraphQL request is received from a client.
      async requestDidStart(requestContext) {
        if (requestContext.request.operationName == "IntrospectionQuery") return {};
        const start = new Date().getTime()

        return {
          async willSendResponse(requestContext) {
            const end = new Date().getTime()

            const elapsed = end - start;

            if (elapsed > 5000) {
              await prisma.perfomanceAnalytic.create({
                data: {
                  operationName: requestContext.request.operationName ?? "unnamed",
                  query: requestContext.request.query ?? "noquery",
                  variables: JSON.stringify(requestContext?.request?.variables ?? {}),
                  time: end - start,
                }
              })
              // console.log(`Operation resolved! ${requestContext.operationName} ${end - start} ms`);
            }
          }
        }
      },
    }]

  });



  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}


startApolloServer();