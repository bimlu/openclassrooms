import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { GET_AUTH_USER } from 'graphql/user';
import { GET_NEW_CONVERSATIONS_SUBSCRIPTION } from 'graphql/messages';
import { NOTIFICATION_CREATED_OR_DELETED } from 'graphql/notification';
import { GET_COLLEGES_WITH_PROGRAMMES_COURSES } from 'graphql/college';

import { Loading } from 'components/Loading';
import Message from 'components/Message';
import NotFound from 'components/NotFound';
import AppLayout from './AppLayout';
import ScrollToTop from './ScrollToTop';
import AuthLayout from 'pages/Auth/AuthLayout';
import PrivacyPolicy from 'pages/About/PrivacyPolicy';
import TermsAndConditions from 'pages/About/TermsAndConditions';
import AboutUs from 'pages/About/AboutUs';
import ContactUs from 'pages/About/ContactUs';

import { useThemeToggler } from 'hooks/useThemeToggler';

import { useStore } from 'store';
import { SET_DATA_TREE } from 'store/datatree';
import { SET_AUTH_USER } from 'store/auth';
import { CLEAR_EXPLORE_ROUTE, CLEAR_PEOPLE_ROUTE } from 'store/route';

import { COLLEGE_TREE_ITEM_LIMIT } from 'constants/DataLimit';

import * as Routes from 'routes';

/**
 * Root component of the app
 */
const App = () => {
  const [themeMode, toggleThemeMode] = useThemeToggler();
  const lightTheme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: 'light',
          border: {
            light: '#f5f5f5',
            main: '#e0e0e0',
            dark: '#bdbdbd',
          },
        },
        zIndex: {
          xs: 10,
          sm: 20,
          md: 30,
          lg: 40,
          xl: 50,
        },
        overrides: {
          MuiCssBaseline: {
            '@global': {
              '*::-webkit-scrollbar': {
                width: '0.55em',
              },
              '*::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.4)',
                borderRadius: '2em',
              },
            },
          },
        },
      }),
    [themeMode]
  );

  const darkTheme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: 'dark',
          border: {
            light: '#f5f5f5',
            main: '#e0e0e0',
            dark: '#bdbdbd',
          },
          primary: {
            main: '#64b5f6',
          },
          secondary: {
            main: '#f48fb1',
          },
        },
        zIndex: {
          xs: 10,
          sm: 20,
          md: 30,
          lg: 40,
          xl: 50,
        },
        overrides: {
          MuiCssBaseline: {
            '@global': {
              '*::-webkit-scrollbar': {
                width: '0.55em',
              },
              '*::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,.4)',
                borderRadius: '2em',
              },
            },
          },
        },
      }),
    [themeMode]
  );

  const [{ message, datatree }, dispatch] = useStore();
  const { loading, subscribeToMore, data: authUserData, error } = useQuery(GET_AUTH_USER);
  const { data: collegesData } = useQuery(GET_COLLEGES_WITH_PROGRAMMES_COURSES, {
    variables: {
      skip: 0,
      limit: COLLEGE_TREE_ITEM_LIMIT,
    },
  });

  useEffect(() => {
    dispatch({ type: CLEAR_EXPLORE_ROUTE });
    dispatch({ type: CLEAR_PEOPLE_ROUTE });
  }, []);

  useEffect(() => {
    authUserData && dispatch({ type: SET_AUTH_USER, payload: authUserData.getAuthUser });
  }, [authUserData]);

  useEffect(() => {
    collegesData && dispatch({ type: SET_DATA_TREE, payload: collegesData.getColleges.colleges });
  }, [collegesData]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: NOTIFICATION_CREATED_OR_DELETED,
      updateQuery: async (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const oldNotifications = prev.getAuthUser.newNotifications;
        const { operation, notification } = subscriptionData.data.notificationCreatedOrDeleted;

        let newNotifications;

        if (operation === 'CREATE') {
          // Don't show message notification in Header if user already is on notifications page
          if (window.location.href.split('/')[3] === 'notifications') {
            return prev;
          }

          // Add new notification
          newNotifications = [notification, ...oldNotifications];
        } else {
          // Remove from notifications
          const notifications = oldNotifications;
          const index = notifications.findIndex((n) => n.id === notification.id);
          if (index > -1) {
            notifications.splice(index, 1);
          }

          newNotifications = notifications;
        }

        // Attach new notifications to authUser
        const authUser = prev.getAuthUser;
        authUser.newNotifications = newNotifications;

        return { getAuthUser: authUser };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GET_NEW_CONVERSATIONS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const oldConversations = prev.getAuthUser.newConversations;
        const { newConversation } = subscriptionData.data;

        // Don't show message notification in Header if user already is on messages page
        if (window.location.href.split('/')[3] === 'messages') {
          return prev;
        }

        // If authUser already has unseen message from that user,
        // remove old message, so we can show the new one
        const index = oldConversations.findIndex((u) => u.id === newConversation.id);
        if (index > -1) {
          oldConversations.splice(index, 1);
        }

        // Merge conversations
        const mergeConversations = [newConversation, ...oldConversations];

        // Attach new conversation to authUser
        const authUser = prev.getAuthUser;
        authUser.newConversations = mergeConversations;

        return { getAuthUser: authUser };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

  if (error) {
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.error(error);
    }
    const devErrorMessage =
      'Sorry, something went wrong. Please open the browser console to view the detailed error message.';
    const prodErrorMessage = "Sorry, something went wrong. We're working on getting this fixed as soon as we can.";
    return <NotFound message={isDevelopment ? devErrorMessage : prodErrorMessage} showHomePageLink={false} />;
  }

  if (loading || !datatree.colleges) {
    return <Loading top="xl" />;
  }

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />

      <Router>
        <ScrollToTop>
          <Switch>
            <Route path={Routes.AUTH}>
              <AuthLayout />
            </Route>

            <Route exact path={Routes.PRIVACY_POLICY}>
              <PrivacyPolicy />
            </Route>

            <Route exact path={Routes.TERMS_AND_CONDITIONS}>
              <TermsAndConditions />
            </Route>

            <Route exact path={Routes.ABOUT_US}>
              <AboutUs />
            </Route>

            <Route exact path={Routes.CONTACT_US}>
              <ContactUs />
            </Route>

            <Route exact>
              <AppLayout toggleThemeMode={toggleThemeMode} />
            </Route>
          </Switch>
        </ScrollToTop>

        {message.content.text && (
          <Message type={message.content.type} autoClose={message.content.autoClose}>
            {message.content.text}
          </Message>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
