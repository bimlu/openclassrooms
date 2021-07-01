import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Redirect, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Alert from '@material-ui/lab/Alert';

import { CREATE_COURSE, GET_COLLEGE_PROGRAMME_COURSES } from 'graphql/course';
import { GET_COLLEGES_WITH_PROGRAMMES_COURSES } from 'graphql/college';

import { EXPLORE_PAGE_CARDS_LIMIT } from 'constants/DataLimit';
import { MAX_POST_IMAGE_SIZE } from 'constants/ImageSize';

import Head from 'components/Head';
import SimpleHeader from 'components/SimpleHeader';

import { useStore } from 'store';
import { SET_UPLOADING, CLEAR_UPLOADING } from 'store/uploading';

import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
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
  alert: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
}));

export default function CreateCourse() {
  const [{ auth, status }, dispatch] = useStore();
  if (!auth.user) {
    return <Redirect to={Routes.AUTH} />;
  }

  const classes = useStyles();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const collegeId = query.get('collegeId');
  const programmeId = query.get('programmeId');

  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [term, setTerm] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [createCourse, { loading }] = useMutation(CREATE_COURSE, {
    refetchQueries: [
      {
        query: GET_COLLEGE_PROGRAMME_COURSES,
        variables: {
          collegeId: collegeId,
          programmeId: programmeId,
          skip: 0,
          limit: EXPLORE_PAGE_CARDS_LIMIT,
        },
      },
      {
        query: GET_COLLEGES_WITH_PROGRAMMES_COURSES,
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
    } else if (key === 'term') {
      setTerm(value);
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
      await createCourse({
        variables: {
          input: {
            name,
            image: photo,
            fullName,
            term: parseInt(term),
            description,
            collegeId,
            programmeId,
            createdBy: auth.user.id,
          },
        },
      });

      handleReset();
      setMessage('Successfully created course!');
      setSeverity('success');
      setOpen(true);
    } catch (err) {
      setMessage(err.graphQLErrors[0] ? err.graphQLErrors[0].message : 'Something went wrong, Please try again!');
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleReset = () => {
    setName('');
    setFullName('');
    setTerm('');
    setDescription('');
    setPhoto('');
  };

  const isCreateDisabled =
    status.uploading || !name || !fullName || !term || !description || !photo || !collegeId || !programmeId;

  return (
    <>
      <Head title="New course" desc="Add a new course to an existing programme" />

      <SimpleHeader heading="New Course" loading={status.uploading} />

      <Alert severity="info" className={classes.alert}>
        You need to be Admin to be able to create a new course. (becoming admin/mod functionality might come in future)
      </Alert>

      <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} className={classes.snackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={() => setOpen(false)} severity={severity}>
            {message}
          </MuiAlert>
        </Snackbar>

        <TextField
          id="name"
          label="Name"
          placeholder="Course name (e.g. CS-101)"
          value={name}
          onChange={handleChange}
          variant="outlined"
          required
        />

        <TextField
          id="fullName"
          label="Full name"
          placeholder="Full name (e.g. Introduction to Computer Science)"
          value={fullName}
          onChange={handleChange}
          variant="outlined"
          required
        />

        <TextField
          type="number"
          id="term"
          label="Semester/Year"
          placeholder="A Number between 1-10"
          value={term}
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
    </>
  );
}
