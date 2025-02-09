import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const createApolloClient = () => {
  return new ApolloClient({
    link: createUploadLink({
      uri: `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
