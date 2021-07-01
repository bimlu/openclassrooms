import React from 'react';
import { Link, generatePath } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import ToggleThemeIcon from '@material-ui/icons/Brightness4';

import HideOnScroll from './HideOnScroll';
import SignOut from 'components/App/Header/SignOut';
import SiteInfo from 'constants/SiteInfo.json';

import { useStore } from 'store';
import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  toolBar: {
    [theme.breakpoints.up('lg')]: {
      width: theme.breakpoints.values.lg,
      margin: '0 auto',
    },
  },
  title: {
    color: theme.palette.action,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: '1.8rem',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const Header = ({ toggleThemeMode }) => {
  const [{ auth }] = useStore();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {auth.user && (
        <MenuItem
          dense
          onClick={handleMenuClose}
          component={Link}
          to={generatePath(Routes.USER_PROFILE, { id: auth.user.id })}
        >
          <IconButton aria-label="account of current user" color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      )}

      {auth.user && <SignOut handleClick={handleMenuClose} />}

      {!auth.user && (
        <MenuItem dense onClick={handleMenuClose} component={Link} to={Routes.LOG_IN}>
          <IconButton aria-label="sign in" color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Sign in</p>
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = 'menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {auth.user && (
        <MenuItem
          dense
          onClick={handleMobileMenuClose}
          component={Link}
          to={generatePath(Routes.MESSAGES, { userId: Routes.NEW_ID_VALUE })}
        >
          <IconButton aria-label="show new mails" color="inherit">
            <Badge variant="dot" invisible={!auth.user.newConversations.length} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
      )}

      {auth.user && (
        <MenuItem dense onClick={handleMobileMenuClose} component={Link} to={Routes.NOTIFICATIONS}>
          <IconButton aria-label="show new notifications" color="inherit">
            <Badge variant="dot" invisible={!auth.user.newNotifications.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
      )}

      {auth.user && <SignOut handleClick={handleMenuClose} />}

      {!auth.user && (
        <MenuItem dense onClick={handleMobileMenuClose} component={Link} to={Routes.LOG_IN}>
          <IconButton aria-label="sign in" color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Sign in</p>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <HideOnScroll>
        <AppBar position="fixed" color="inherit">
          <Toolbar className={classes.toolBar}>
            <Typography className={classes.title} variant="h6" noWrap>
              {SiteInfo.name}
            </Typography>

            <div className={classes.grow} />

            <IconButton aria-label="toggle theme" onClick={toggleThemeMode} color="inherit">
              <ToggleThemeIcon />
            </IconButton>

            <div className={classes.sectionDesktop}>
              {auth.user && (
                <IconButton
                  aria-label="show new messages"
                  color="inherit"
                  component={Link}
                  to={generatePath(Routes.MESSAGES, { userId: Routes.NEW_ID_VALUE })}
                >
                  <Badge variant="dot" invisible={!auth.user.newConversations.length} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
              )}

              {auth.user && (
                <IconButton
                  aria-label="show new notifications"
                  color="inherit"
                  component={Link}
                  to={Routes.NOTIFICATIONS}
                >
                  <Badge variant="dot" invisible={!auth.user.newNotifications.length} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              )}

              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>

            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Toolbar />

      {renderMobileMenu}

      {renderMenu}
    </div>
  );
};

export default Header;
