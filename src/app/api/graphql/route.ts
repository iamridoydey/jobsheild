import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import typeDefs from "@/app/graphql/schema.graphql";
import resolvers from "@/app/graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Export the handler for GraphQL
const handler = startServerAndCreateNextHandler<NextRequest>(server);

export {handler as GET, handler as POST}