import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Header from 'components/App/Header';
import { Spacing } from 'components/Layout';
import BottomNavigation from 'components/App/BottomNavigation';
import NotFound from 'components/NotFound';

import SideBar from './SideBar';
import UserSuggestions from './UserSuggestions';

import Home from 'pages/Home';
import Explore from 'pages/Explore';
import People from 'pages/People';
import Notifications from 'pages/Notifications';
import Profile from 'pages/Profile';
import Messages from 'pages/Messages';

import { College, Colleges, CreateCollege } from 'pages/College';
import { Programme, Programmes, CreateProgramme } from 'pages/Programme';
import { Course, Courses, CreateCourse } from 'pages/Course';
import { Post, Posts, CreatePost } from 'pages/Post';

import { useStore } from 'store';
import * as Routes from 'routes';

/**
 * Main layout of the app, when user is authenticated
 */
const AppLayout = ({ toggleThemeMode }) => {
  const [{ auth }] = useStore();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <Header toggleThemeMode={toggleThemeMode} />

      <Spacing top={isDesktop && 'sm'} bottom="xl">
        <Container>
          <Grid container spacing={isDesktop ? 4 : 2}>
            <Grid item xs={3}>
              <SideBar />
            </Grid>

            <Grid item xs={isDesktop ? 6 : 12}>
              <Switch>
                {/* College App List Pages */}
                <Route exact path={Routes.COLLEGES}>
                  <Colleges />
                </Route>

                <Route exact path={Routes.PROGRAMMES}>
                  <Programmes />
                </Route>

                <Route exact path={Routes.COURSES}>
                  <Courses />
                </Route>

                <Route exact path={Routes.POSTS}>
                  <Posts />
                </Route>
                {/* *************** */}

                {/* College App Detail pages */}
                <Route exact path={Routes.COLLEGE}>
                  <College />
                </Route>

                <Route exact path={Routes.PROGRAMME}>
                  <Programme />
                </Route>

                <Route exact path={Routes.COURSE}>
                  <Course />
                </Route>

                <Route exact path={Routes.POST}>
                  <Post />
                </Route>
                {/* *************** */}

                {/* College App Create pages */}
                <Route exact path={Routes.CREATE_COLLEGE}>
                  <CreateCollege />
                </Route>

                <Route exact path={Routes.CREATE_PROGRAMME}>
                  <CreateProgramme />
                </Route>

                <Route exact path={Routes.CREATE_COURSE}>
                  <CreateCourse />
                </Route>

                <Route exact path={Routes.CREATE_POST}>
                  <CreatePost />
                </Route>
                {/* **************** */}

                {/* Main App pages*/}
                <Route exact path={Routes.HOME}>
                  <Home />
                </Route>

                <Route exact path={Routes.EXPLORE}>
                  <Explore />
                </Route>

                <Route exact path={Routes.PEOPLE}>
                  <People />
                </Route>

                <Route exact path={Routes.NOTIFICATIONS}>
                  <Notifications />
                </Route>

                <Route exact path={Routes.MESSAGES}>
                  <Messages />
                </Route>

                <Route exact path={Routes.USER_PROFILE}>
                  <Profile />
                </Route>
                {/* ************* */}

                {/* Fallback page */}
                <Route>
                  <NotFound />
                </Route>
                {/* ************** */}
              </Switch>
            </Grid>

            {auth.user && isDesktop && (
              <Grid item xs={3}>
                <UserSuggestions />
              </Grid>
            )}
          </Grid>
        </Container>
      </Spacing>

      <BottomNavigation />
    </>
  );
};

export default AppLayout;
