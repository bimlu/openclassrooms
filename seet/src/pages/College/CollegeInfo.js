import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(4),
    background: theme.palette.background.default,
  },
  button: {
    borderRadius: theme.spacing(1.2),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: theme.spacing(1.6),
    marginBottom: theme.spacing(1),
    textTransform: 'none',
  },
  number: {
    color: theme.palette.primary.main,
  },
}));

const CollegeInfo = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography gutterBottom>Explore Colleges, Programmes, Courses and Posts. 😍🔥📖🎓💐😊✨</Typography>

      <Divider />

      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="h5" color="textSecondary" style={{ marginLeft: 8 }} display="inline">
          Colleges
        </Typography>

        <Button
          component={Link}
          to={Routes.CREATE_COLLEGE}
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

export default CollegeInfo;
