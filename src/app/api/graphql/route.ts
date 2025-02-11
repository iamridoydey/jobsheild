import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import typeDefs from "@/app/graphql/schema.graphql";
import resolvers from "@/app/graphql/resolvers";
import { NextApiRequest, NextApiResponse } from "next";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Define the handler function that properly handles the context
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const nextHandler = startServerAndCreateNextHandler<NextRequest>(server);
  return nextHandler(req, res);
};

export const GET = handler;
export const POST = handler;
