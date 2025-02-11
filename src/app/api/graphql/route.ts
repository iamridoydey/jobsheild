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
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

// Wrap the handler to match the expected Next.js API route signature
const wrappedHandler = async (req: NextRequest) => {
  return handler(req);
};

export const GET = wrappedHandler;
export const POST = wrappedHandler;