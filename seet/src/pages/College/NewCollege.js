import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { CREATE_COLLEGE, GET_COLLEGES, GET_COLLEGES_WITH_PROGRAMMES_COURSES } from 'graphql/college';

import { EXPLORE_PAGE_CARDS_LIMIT } from 'constants/DataLimit';
import { MAX_POST_IMAGE_SIZE } from 'constants/ImageSize';
import { HEADER_HEIGHT, HEADER_BORDER_HEIGHT } from 'constants/Layout';

import Head from 'components/Head';
import { useStore } from 'store';
import { SET_UPLOADING, CLEAR_UPLOADING } from 'store/uploading';

import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    minHeight: 600,
    [theme.breakpoints.down('sm')]: {
      minHeight: '100%',
    },
  },
  root: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    height: `${HEADER_HEIGHT + 3}px`,
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: `${HEADER_BORDER_HEIGHT}px`,
      left: 0,
      width: '100%',
      zIndex: theme.zIndex.appBar + 1,
      background: theme.palette.background.paper,
    },
  },
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '96%',
    },
  },
  input: {
    display: 'none',
  },
  button: {
    margin: theme.spacing(1),
  },
  progress: {},
  snackbar: {
    bottom: theme.spacing(7),
  },
  title: {
    fontSize: theme.spacing(3.6),
    fontWeight: 'bold',
    display: 'inline',
    marginLeft: theme.spacing(1),
  },
}));

export default function MultilineTextFields() {
  const classes = useStyles();
  const [{ auth, status }, dispatch] = useStore();

  if (!auth.user) {
    return <Redirect to={Routes.AUTH} />;
  }

  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [createCollege, { loading }] = useMutation(CREATE_COLLEGE, {
    refetchQueries: [
      {
        query: GET_COLLEGES_WITH_PROGRAMMES_COURSES,
      },
      {
        query: GET_COLLEGES,
        variables: {
          skip: 0,
          limit: EXPLORE_PAGE_CARDS_LIMIT,
        },
      },
    ],
  });

  useEffect(() => {
    if (loading) {
      dispatch({ type: SET_UPLOADING, payload: true });
    } else {
      dispatch({ type: CLEAR_UPLOADING, payload: false });
    }
  }, [loading]);

  const handleChange = (e) => {
    const key = e.target.id || e.target.name;
    const value = e.target.value;

    if (key === 'name') {
      setName(value);
    } else if (key === 'fullName') {
      setFullName(value);
    } else if (key === 'description') {
      setDescription(value);
    }
  };

  const handleUpload = (e) => {
    if (status.uploading) return;

    const file = e.target.files[0];

    if (!file) return;

    if (file.size >= MAX_POST_IMAGE_SIZE) {
      setMessage(`File size should be less then ${MAX_POST_IMAGE_SIZE / 1000000}MB`);
      setSeverity('warning');
      setOpen(true);
      return;
    }

    setPhoto(file);
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCollege({
        variables: {
          input: { name, image: photo, fullName, description, createdBy: auth.user.id },
        },
      });

      handleReset();
      setMessage('Successfully created college!');
      setSeverity('success');
      setOpen(true);
    } catch (error) {
      setMessage('Something went wrong, please try again.');
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleReset = () => {
    setName('');
    setFullName('');
    setDescription('');
    setPhoto('');
  };

  const isCreateDisabled = status.uploading || !name || !fullName || !description || !photo;

  return (
    <Paper className={classes.paper}>
      <Head title="New college" desc="Create a new college" />

      <div className={classes.header}>
        <IconButton aria-label="go back" onClick={() => history.back()}>
          <ArrowBackIcon />
        </IconButton>

        <Typography className={classes.title}>New College</Typography>

        {status.uploading && <LinearProgress color="primary" className={classes.progress} />}
      </div>

      <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} className={classes.snackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={() => setOpen(false)} severity={severity}>
            {message}
          </MuiAlert>
        </Snackbar>

        <TextField
          id="name"
          label="Name"
          placeholder="College name (e.g. IIT-DELHI)"
          value={name}
          onChange={handleChange}
          variant="outlined"
          required
        />

        <TextField
          id="fullName"
          label="Full name"
          placeholder="Full name (e.g. Indian institute of technology, Delhi)"
          value={fullName}
          onChange={handleChange}
          variant="outlined"
          required
        />

        <TextField
          id="description"
          label="Description"
          placeholder="Add description"
          multiline
          rows={3}
          rowsMax={10}
          value={description}
          onChange={handleChange}
          variant="outlined"
          required
        />

        <div>
          <input accept="image/*" className={classes.input} id="photos" type="file" onChange={handleUpload} />
          <label htmlFor="photos">
            <IconButton color="primary" aria-label="upload photos" component="span">
              <PhotoCamera />
            </IconButton>
            Select a photo
          </label>
        </div>

        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<CreateIcon />}
          type="submit"
          disabled={isCreateDisabled}
        >
          Create
        </Button>
      </form>
    </Paper>
  );
}
