import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const createApolloClient = () => {
  return new ApolloClient({
    link: createUploadLink({
      uri: `/api/graphql`,
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
