import { ApolloClient, InMemoryCache, from, split } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import Cookies from 'js-cookie';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3007/graphql';
const WS_URL      = process.env.NEXT_PUBLIC_WS_URL      ?? 'ws://localhost:3007/graphql';

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

  const wsLink = typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: WS_URL,
          connectionParams: () => {
            const token = Cookies.get(ACCESS_TOKEN_KEY);
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      )
    : null;

  const splitLink = wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === 'OperationDefinition' && def.operation === 'subscription';
        },
        wsLink,
        from([errorLink, authLink, httpLink]),
      )
    : from([errorLink, authLink, httpLink]);

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
      query:       { fetchPolicy: 'cache-first' },
    },
  });
};
