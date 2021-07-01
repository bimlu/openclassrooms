import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider as LocalThemeProvider } from 'styled-components';

import App from 'components/App';
import { createApolloClient } from 'utils/apollo-client';

import localTheme from 'theme';
import { StoreProvider } from 'store';

// GraphQL HTTP URL
const API_URL = `${process.env.REACT_APP_API_URL}/graphql`;

// GraphQL WebSocket (subscriptions) URL.
// If its url is not set in .env then it has same url, host and pathname
const WEBSOCKET_API_URL = process.env.REACT_APP_WEBSOCKET_API_URL;
const websocketApiUrl = WEBSOCKET_API_URL
  ? WEBSOCKET_API_URL
  : API_URL.replace('http://', 'ws://').replace('http://', 'ws://');

// Create a Apollo client
const apolloClient = createApolloClient(API_URL, `${websocketApiUrl}/graphql`);

render(
  <ApolloProvider client={apolloClient}>
    <LocalThemeProvider theme={localTheme}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </LocalThemeProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
