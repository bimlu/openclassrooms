import React from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

import Follow from 'components/Follow';

import { useStore } from 'store';

import * as Routes from 'routes';

const useStyles = makeStyles({
  list: {
    minWidth: 260,
  },
});

/**
 * Post Card options, meant to be used in PostCard components Modal
 */
const PostCardOption = ({ postId, author, open, handleClose, deletePost, link }) => {
  const [{ auth }] = useStore();
  const classes = useStyles();

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(
        link ||
          `${process.env.REACT_APP_FRONTEND_URL}${generatePath(Routes.POST, {
            id: postId,
            type: 'image',
          })}`
      );
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error);
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <List className={classes.list}>
        <Divider />

        {auth.user && auth.user.id === author.id ? (
          <ListItem
            button
            divider
            alignItems="center"
            onClick={() => {
              deletePost();
              handleClose();
            }}
          >
            <ListItemText primary="Delete post" />
          </ListItem>
        ) : (
          <ListItem divider alignItems="center">
            <ListItemIcon>
              <Follow user={author} />
            </ListItemIcon>
          </ListItem>
        )}

        <ListItem button divider onClick={copyToClipboard} alignItems="center">
          <ListItemText primary="Copy link" />
        </ListItem>

        <ListItem button divider alignItems="center" onClick={handleClose}>
          <ListItemText primary="Cancel" />
        </ListItem>
      </List>
    </Dialog>
  );
};

PostCardOption.propTypes = {
  postId: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  link: PropTypes.string,
};

export default PostCardOption;
