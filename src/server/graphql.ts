import { makeSchema, fieldAuthorizePlugin } from "nexus";
import { join } from "path";
import { ApolloServer } from "apollo-server";

import * as  customtypes from "../models";
import * as types from "../graphql";
import { context } from "../modules/Context";
import { paljs } from '@paljs/nexus';
import { SECRET_KEY } from '../modules/Key';

export const schema = makeSchema({

  types: [types, customtypes], // 1
  plugins: [paljs(), fieldAuthorizePlugin(),],
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

export const server = new ApolloServer({
  //@ts-ignore
  schema,
  formatError: (e) => {
    console.log(e)
    return e;
  },
  context: async ({ req }) => {
    // Get the user token from the headers.
    const token = req.headers.authorization || "";

    // if (!token) return context;

    // // Try to retrieve a user with the token
    // const user = (await verifyJWT(token)) as User | undefined;

    // if (user) {
    //   // console.log(`logged ${user?.name}`);
    // } else {
    //   console.log(`not logged ${token}`);
    // }

    return {
      // user,
      // isLogged: !!user,
      // isAdmin: user?.isAdmin || false,
      gotKey: req.headers.authorization == SECRET_KEY,
      ...context,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
