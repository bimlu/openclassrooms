import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import SwipeableViews from 'react-swipeable-views';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBackIosRounded';
import NextIcon from '@material-ui/icons/ArrowForwardIosRounded';
import CloseIcon from '@material-ui/icons/Close';

import Modal from 'components/Modal';
import NotFound from 'components/NotFound';
import Head from 'components/Head';

import { GET_POST } from 'graphql/post';

import NewPost from './NewPost';
import NewPDF from './NewPDF';

import * as Routes from 'routes';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '600px',
    zIndex: theme.zIndex.appBar + 1,
    position: 'fixed',
    top: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: theme.palette.text.primary,
  },
  slide: {},
  img: {
    display: 'block',
    width: '100%',
    objectFit: 'cover',
  },
  button: {
    position: 'absolute',
    zIndex: theme.zIndex.xl + 1,
    '&:hover': {
      background: theme.palette.background.default,
    },
    display: (props) => (props.hide ? 'none' : 'block'),
  },
  info: {
    position: 'absolute',
    left: '44%',
    bottom: 16,
    zIndex: theme.zIndex.xl + 1,
    '&:hover': {
      background: theme.palette.background.default,
    },
    display: (props) => (props.hide ? 'none' : 'block'),
    background: theme.palette.background.default,
    padding: theme.spacing(1.5),
    borderRadius: '50%',
  },
}));

/**
 * Post detail page
 */
const Post = () => {
  const { id, type } = useParams();
  if (id === Routes.NEW_ID_VALUE) {
    return type === 'pdf' ? <NewPDF /> : <NewPost />;
  }

  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);
  const [hide, setHide] = useState(false);
  const classes = useStyles({ hide: hide });
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id },
  });

  const handleNext = (e) => {
    e.stopPropagation();
    if (index === images.length - 1) return;
    setIndex(index + 1);
  };

  const handleBack = (e) => {
    e.stopPropagation();
    if (index === 0) return;
    setIndex(index - 1);
  };

  const handleClose = () => {
    window.history.back();
    setOpen(false);
  };

  const handleSwitch = (index, type) => {
    if (type === 'end') {
      setIndex(index);
    }
  };

  if (loading)
    return (
      <Modal open={open} onClose={handleClose} zIndex={2000}>
        <CircularProgress color="inherit" />
      </Modal>
    );

  if (error) return <NotFound />;

  const images = data.getPost.images;

  return (
    <Modal open={open} onClose={handleClose} zIndex={2000}>
      <Head title={data.getPost.title} />

      <div className={classes.root} onClick={() => setHide(!hide)}>
        <IconButton onClick={handleClose} className={classes.button} style={{ top: 10, right: 10 }}>
          <CloseIcon fontSize="large" color="primary" />
        </IconButton>

        <IconButton onClick={handleBack} className={classes.button} style={{ bottom: 10, left: 10 }}>
          <BackIcon fontSize="large" color="primary" />
        </IconButton>

        <IconButton onClick={handleNext} className={classes.button} style={{ bottom: 10, right: 10 }}>
          <NextIcon fontSize="large" color="primary" />
        </IconButton>

        <div className={classes.info} onClick={(e) => e.stopPropagation()}>
          <Typography color="textPrimary">
            {index + 1}/{images.length}
          </Typography>
        </div>

        <SwipeableViews
          enableMouseEvents
          index={index}
          slideClassName={classes.slide}
          animateHeight={true}
          onSwitching={(index, type) => handleSwitch(index, type)}
        >
          {data.getPost.images.map((image) => (
            <img key={image} alt={image} src={image} className={classes.img} />
          ))}
        </SwipeableViews>
      </div>
    </Modal>
  );
};

export default Post;
