import React, { useState } from 'react';

import { useQuery, useApolloClient } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import { GET_COURSE, DELETE_COURSE, UPDATE_COURSE, TOGGLE_COURSE_VERIFICATION } from 'graphql/course';
import { GET_COLLEGE_PROGRAMME_COURSES } from 'graphql/course';

import { MAX_POST_IMAGE_SIZE } from 'constants/ImageSize';

import NewCourse from './NewCourse';
import SimpleHeader from 'components/SimpleHeader';
import NotFound from 'components/NotFound';

import { EXPLORE_PAGE_CARDS_LIMIT } from 'constants/DataLimit';
import { UserRole } from 'constants/UserRole';

import { useStore } from 'store';
import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: 300,
    marginBottom: theme.spacing(4),
    background: theme.palette.background.default,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '96%',
    },
  },
  imageWrapper: {
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  button: {
    borderRadius: theme.spacing(1.2),
    padding: theme.spacing(1.4),
    fontSize: theme.spacing(1.2),
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  number: {
    color: theme.palette.primary.main,
  },
  snackbar: {
    bottom: theme.spacing(7),
  },
  input: {
    display: 'none',
  },
}));

const Course = () => {
  const [{ auth }] = useStore();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const client = useApolloClient();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [term, setTerm] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [severity, setSeverity] = useState('error');

  if (id === Routes.NEW_ID_VALUE) {
    return <NewCourse />;
  }

  const { loading: initialLoading, data } = useQuery(GET_COURSE, {
    variables: {
      id: id,
    },
  });

  const handleDelete = async (e, imagePublicId, collegeId, programmeId) => {
    if (!auth.user) return;
    if (loading) return;
    setLoading(true);

    try {
      await client.mutate({
        mutation: DELETE_COURSE,
        variables: { input: { id: id, imagePublicId: imagePublicId } },
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
        ],
      });
      // go back to Courses page
      history.go(-2);
    } catch (err) {
      setMessage(err.graphQLErrors[0] ? err.graphQLErrors[0].message : 'Something went wrong, Please try again!');
      setOpen(true);
    }

    setLoading(false);
  };

  const handleVerify = async () => {
    if (!auth.user) return;
    if (loading) return;
    setLoading(true);

    try {
      await client.mutate({
        mutation: TOGGLE_COURSE_VERIFICATION,
        variables: { id: id },
        refetchQueries: [
          {
            query: GET_COURSE,
            variables: { id: id },
          },
        ],
      });
    } catch (err) {
      setMessage('Something went wrong, Please try again!');
      setOpen(true);
    }

    setLoading(false);
  };

  const handleEdit = async () => {
    setEditing(!editing);
    setName(course.name);
    setFullName(course.fullName);
    setTerm(course.term);
    setDescription(course.description);
    setPhoto(course.image);
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

  const handleUpdate = async () => {
    if (!auth.user) return;
    if (loading) return;
    setLoading(true);

    try {
      await client.mutate({
        mutation: UPDATE_COURSE,
        variables: {
          input:
            typeof photo !== 'string'
              ? { id, name, image: photo, fullName, term: parseInt(term), description, updatedBy: auth.user.id }
              : { id, name, fullName, term: parseInt(term), description, updatedBy: auth.user.id },
        },
        refetchQueries: [
          {
            query: GET_COURSE,
            variables: { id: id },
          },
          {
            query: GET_COURSE,
            variables: {
              id: id,
            },
          },
        ],
      });

      setMessage('Successfully updated course!');
      setSeverity('success');
      setOpen(true);
    } catch (err) {
      setMessage(err.graphQLErrors[0] ? err.graphQLErrors[0].message : 'Something went wrong, Please try again!');
      setSeverity('error');
      setOpen(true);
    }

    setEditing(false);
    setLoading(false);
  };

  const handleChange = (e) => {
    const key = e.target.id || e.target.name;
    const value = e.target.value;

    if (key === 'name') {
      setName(value);
    } else if (key === 'fullName') {
      setFullName(value);
    } else if (key === 'description') {
      setDescription(value);
    } else if (key === 'term') {
      setTerm(value);
    }
  };

  if (initialLoading) {
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
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} className={classes.snackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setOpen(false)} severity={severity}>
          {message}
        </MuiAlert>
      </Snackbar>

      <SimpleHeader loading={loading} />

      {editing ? (
        <TextField
          id="name"
          label="Name"
          placeholder="Course name (e.g. CS-101)"
          value={name}
          onChange={handleChange}
          variant="outlined"
          required
        />
      ) : (
        <Typography variant="h5" gutterBottom>
          {course.name}
        </Typography>
      )}

      {editing ? (
        <TextField
          id="fullName"
          label="Full name"
          placeholder="Full name (e.g. Introduction to Computer Science)"
          value={fullName}
          onChange={handleChange}
          variant="outlined"
          required
        />
      ) : (
        <Typography gutterBottom>{course.fullName}</Typography>
      )}

      {editing ? (
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
      ) : (
        <Typography gutterBottom>Semester/Year: {course.term}</Typography>
      )}

      {editing ? (
        <div>
          <input accept="image/*" className={classes.input} id="photos" type="file" onChange={handleUpload} />
          <label htmlFor="photos">
            <IconButton color="primary" aria-label="upload photos" component="span">
              <PhotoCamera />
            </IconButton>
            Select a photo
          </label>
        </div>
      ) : (
        <>
          <Box mb={2}>
            <Divider />
          </Box>

          <Box my={1} className={classes.imageWrapper}>
            <img alt="course image" src={course.image} className={classes.image} />
          </Box>
        </>
      )}

      {editing ? (
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
      ) : (
        <Typography gutterBottom style={{ whiteSpace: 'pre-line' }}>
          {course.description}
        </Typography>
      )}

      {auth.user && (
        <Button
          onClick={(e) => {
            handleDelete(e, course.imagePublicId);
          }}
          variant="outlined"
          size="small"
          color="secondary"
          className={classes.button}
          disabled={loading || UserRole.ADMIN > auth.user.role}
        >
          Delete
        </Button>
      )}

      {auth.user && (
        <Button
          onClick={handleVerify}
          variant="outlined"
          size="small"
          color="primary"
          className={classes.button}
          disabled={loading || UserRole.ADMIN > auth.user.role}
        >
          {course.verified ? 'Unverify' : 'Verify'}
        </Button>
      )}

      {auth.user && (
        <Button
          onClick={handleEdit}
          variant="outlined"
          size="small"
          color="default"
          className={classes.button}
          disabled={loading || UserRole.ADMIN > auth.user.role}
        >
          {editing ? 'Cancel' : 'Edit'}
        </Button>
      )}

      {auth.user && editing && (
        <Button
          onClick={handleUpdate}
          variant="outlined"
          size="small"
          color="primary"
          className={classes.button}
          disabled={loading || UserRole.ADMIN > auth.user.role}
        >
          Update
        </Button>
      )}
    </Paper>
  );
};

export default Course;
