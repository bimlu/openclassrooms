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

import NotFound from 'components/NotFound';

import { GET_COLLEGE } from 'graphql/college';

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
}));

const ProgrammeInfo = ({ collegeId }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { loading, data } = useQuery(GET_COLLEGE, {
    variables: { id: collegeId },
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

  const college = data.getCollege;

  return (
    <Paper className={classes.paper} elevation={0}>
      <div className={classes.header}>
        <span>
          <Typography display="inline">@{college.name}</Typography>
          {college.verified && <CheckCircleIcon color="primary" className={classes.checkIcon} />}
        </span>

        <IconButton component={Link} to={generatePath(Routes.COLLEGE, { id: college.id })}>
          <EditIcon className={classes.editIcon} />
        </IconButton>
      </div>

      <Typography variant="h5" gutterBottom>
        {college.fullName}
      </Typography>

      <Box mb={2}>
        <Divider />
      </Box>

      <Box my={1} className={classes.imageWrapper}>
        <img alt="college image" src={college.image} className={classes.image} />
      </Box>

      <Typography gutterBottom>
        Number of students: <span className={classes.number}>{college.students.length}</span>
      </Typography>

      <Typography gutterBottom>
        Number of programmes: <span className={classes.number}>{college.programmes.length}</span>
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
          {college.description}
        </Typography>
      </Collapse>

      <Divider />

      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="h5" color="textSecondary" style={{ marginLeft: 8 }} display="inline">
          Programmes
        </Typography>

        <Button
          component={Link}
          to={`${Routes.CREATE_PROGRAMME}?collegeId=${collegeId}`}
          startIcon={<AddIcon />}
          variant="outlined"
          size="small"
          color="primary"
          className={classes.button}
        >
          New
        </Button>
      </Box>
    </Paper>
  );
};

export default ProgrammeInfo;
