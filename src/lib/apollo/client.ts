import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3007/graphql';

export const createApolloClient = () => {
  const httpLink = new UploadHttpLink({
    uri: GRAPHQL_URL,
    credentials: 'include',
  });

  const authLink = setContext((_, { headers }) => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);

    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const errorLink = onError(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
      console.error('GraphQL errors:', error.errors);
      return;
    }

    console.error('Network error:', error);
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
};
