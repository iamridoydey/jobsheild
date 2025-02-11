import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import typeDefs from "@/app/graphql/schema.graphql";
import resolvers from "@/app/graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Define the handler function to handle the request and context properly
const handler = startServerAndCreateNextHandler<NextRequest>(server);

export const GET = handler;
export const POST = handler;
