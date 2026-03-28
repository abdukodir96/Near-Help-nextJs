'use client';

import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {authStorage} from '@/lib/auth/tokens';

const graphqlUri = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3007/graphql';

export const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: graphqlUri,
    fetchOptions: {
      cache: 'no-store'
    }
  });

  const authLink = setContext((_, {headers}) => {
    const accessToken = authStorage.getAccessToken();

    return {
      headers: {
        ...headers,
        ...(accessToken ? {authorization: `Bearer ${accessToken}`} : {})
      }
    };
  });

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache()
  });
};
