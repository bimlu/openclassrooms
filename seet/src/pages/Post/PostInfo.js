import React, { useState } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { GET_COURSE } from 'graphql/course';
import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: 300,
    marginBottom: theme.spacing(4),
    background: theme.palette.background.default,
  },
  imageWrapper: {
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  button: {
    borderRadius: theme.spacing(1.2),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: theme.spacing(1.6),
    marginBottom: theme.spacing(1),
    textTransform: 'none',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: theme.spacing(2.6),
    '& > *': {
      fontSize: 'inherit',
    },
  },
  checkIcon: {
    fontSize: theme.spacing(2),
    marginLeft: theme.spacing(0.6),
  },
  editIcon: {
    fontSize: theme.spacing(2.6),
  },
  number: {
    color: theme.palette.primary.main,
  },
  list: {
    minWidth: 260,
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
    '& > *': {
      '&:hover': {
        background: theme.palette.background.default,
      },
    },
  },
}));

const PostInfo = ({ collegeId, programmeId, courseId, courseName }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { loading, data } = useQuery(GET_COURSE, {
    variables: { id: courseId },
  });

  if (loading) {
    return (
      <Paper className={classes.paper}>
        <Skeleton variant="rect" height={300} />
      </Paper>
    );
  }

  if (!data) {
    return <NotFound />;
  }

  const course = data.getCourse;

  return (
    <Paper className={classes.paper} elevation={0}>
      <div className={classes.header}>
        <span>
          <Typography display="inline">@{course.name}</Typography>
          {course.verified && <CheckCircleIcon color="primary" className={classes.checkIcon} />}
        </span>

        <IconButton component={Link} to={generatePath(Routes.COURSE, { id: course.id })}>
          <EditIcon className={classes.editIcon} />
        </IconButton>
      </div>

      <Typography variant="h5" gutterBottom>
        {course.fullName}
      </Typography>

      <Box mb={2}>
        <Divider />
      </Box>

      <Box my={1} className={classes.imageWrapper}>
        <img alt="course image" src={course.image} className={classes.image} />
      </Box>

      <Typography gutterBottom color="textSecondary">
        Number of students: <span className={classes.number}>{course.students.length}</span>
      </Typography>

      <Typography gutterBottom color="textSecondary">
        Number of posts: <span className={classes.number}>{course.posts.length}</span>
      </Typography>

      <Button
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
        endIcon={
          <ExpandMoreIcon
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
          />
        }
        variant="outlined"
        size="small"
        color="secondary"
        className={classes.button}
      >
        See more
      </Button>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Typography gutterBottom variant="body2" style={{ whiteSpace: 'pre-line' }}>
          {course.description}
        </Typography>
      </Collapse>

      <Divider />

      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="h5" color="textSecondary" style={{ marginLeft: 8 }} display="inline">
          Posts
        </Typography>

        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          size="small"
          color="primary"
          className={classes.button}
          onClick={() => setOpen(true)}
        >
          New
        </Button>
      </Box>

      <Dialog onClose={() => setOpen(false)} aria-labelledby="dialog-title" open={open}>
        <DialogTitle>Create New Post</DialogTitle>

        <Divider />

        <List className={classes.list}>
          <ListItem
            divider
            component={Link}
            to={`${Routes.CREATE_POST}?collegeId=${collegeId}&programmeId=${programmeId}&courseId=${courseId}&courseName=${courseName}&type=image`}
          >
            <ListItemText primary="New Post (Photos)" secondary="Upload photos" />
          </ListItem>

          <ListItem
            divider
            component={Link}
            to={`${Routes.CREATE_POST}?collegeId=${collegeId}&programmeId=${programmeId}&courseId=${courseId}&courseName=${courseName}&type=pdf`}
          >
            <ListItemText primary="New Post (File)" secondary="Upload pdf / docx" />
          </ListItem>
        </List>
      </Dialog>
    </Paper>
  );
};

export default PostInfo;
