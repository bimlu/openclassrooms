import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
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

import { GET_FOLLOWED_POSTS, GET_COLLEGE_PROGRAMME_COURSE_POSTS, CREATE_POST } from 'graphql/post';
import { GET_AUTH_USER, GET_USER_POSTS } from 'graphql/user';

import { EXPLORE_PAGE_CARDS_LIMIT, PROFILE_PAGE_POSTS_LIMIT } from 'constants/DataLimit';
import { HOME_PAGE_POSTS_LIMIT } from 'constants/DataLimit';
import { MAX_POST_IMAGE_SIZE } from 'constants/ImageSize';
import { HEADER_HEIGHT, HEADER_BORDER_HEIGHT } from 'constants/Layout';

import Head from 'components/Head';
import { useStore } from 'store';
import { SET_UPLOADING, CLEAR_UPLOADING } from 'store/status';

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
  const [{ auth, datatree, status }, dispatch] = useStore();

  if (!auth.user) {
    return <Redirect to={Routes.AUTH} />;
  }

  const [title, setTitle] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [programmeId, setProgrammeId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [colleges] = useState(datatree.colleges);
  const [programmes, setProgrammes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {
        query: GET_COLLEGE_PROGRAMME_COURSE_POSTS,
        variables: {
          collegeId,
          programmeId,
          courseId,
          skip: 0,
          limit: EXPLORE_PAGE_CARDS_LIMIT,
        },
      },
      {
        query: GET_FOLLOWED_POSTS,
        variables: {
          userId: auth.user.id,
          skip: 0,
          limit: HOME_PAGE_POSTS_LIMIT,
        },
      },
      { query: GET_AUTH_USER },
      {
        query: GET_USER_POSTS,
        variables: {
          userId: auth.user.id,
          skip: 0,
          limit: PROFILE_PAGE_POSTS_LIMIT,
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

    if (key === 'title') {
      setTitle(value);
    } else if (key === 'collegeId' && value !== '') {
      setCollegeId(value);
      setProgrammes(() => colleges.find((college) => college.id === value).programmes);
    } else if (key === 'programmeId' && value !== '') {
      setProgrammeId(value);
      setCourses(() => programmes.find((programme) => programme.id === value).courses);
    } else if (key === 'courseId' && value !== '') {
      setCourseId(value);
    }
  };

  const handleUpload = (e) => {
    if (status.uploading) return;

    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    for (let file of files) {
      if (file.size >= MAX_POST_IMAGE_SIZE) {
        setMessage(`File size should be less then ${MAX_POST_IMAGE_SIZE / 1000000}MB`);
        setSeverity('warning');
        setOpen(true);
        return;
      }
    }

    setPhotos(files);
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        variables: {
          input: { title, images: photos, authorId: auth.user.id, collegeId, programmeId, courseId },
        },
      });

      handleReset();
      setMessage('Successfully created assignments!');
      setSeverity('success');
      setOpen(true);
    } catch (error) {
      setMessage('Something went wrong, please try again.');
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleReset = () => {
    setTitle('');
    setPhotos([]);
    setCollegeId('');
    setProgrammeId('');
    setCourseId('');
    setProgrammes([]);
    setCourses([]);
  };

  const isCreateDisabled = status.uploading || !title || !photos || !collegeId || !programmeId || !courseId;

  return (
    <Paper className={classes.paper}>
      <Head title="New post (photos)" desc="Upload assiginments as photos" />

      <div className={classes.header}>
        <IconButton aria-label="go back" onClick={() => history.back()}>
          <ArrowBackIcon />
        </IconButton>

        <Typography className={classes.title}>New Post</Typography>

        {status.uploading && <LinearProgress color="primary" className={classes.progress} />}
      </div>

      <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} className={classes.snackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={() => setOpen(false)} severity={severity}>
            {message}
          </MuiAlert>
        </Snackbar>

        <TextField
          id="title"
          label="Title"
          placeholder="Love you all :)"
          value={title}
          onChange={handleChange}
          variant="outlined"
          required
        />

        <TextField
          name="collegeId"
          select
          label="College"
          value={collegeId}
          onChange={handleChange}
          helperText="Please select a College"
          variant="outlined"
          required
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {colleges.map((college) => (
            <MenuItem key={college.id} value={college.id}>
              {college.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          name="programmeId"
          select
          label="Programme"
          value={programmeId}
          onChange={handleChange}
          helperText="Please select a Programme"
          variant="outlined"
          required
          disabled={!collegeId}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {programmes.map((programme) => (
            <MenuItem key={programme.id} value={programme.id}>
              {programme.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          name="courseId"
          select
          label="Course"
          value={courseId}
          onChange={handleChange}
          helperText="Please select a Course"
          variant="outlined"
          required
          disabled={!programmeId}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </TextField>

        <div>
          <input accept="image/*" className={classes.input} id="photos" type="file" multiple onChange={handleUpload} />
          <label htmlFor="photos">
            <IconButton color="primary" aria-label="upload photos" component="span">
              <PhotoCamera />
            </IconButton>
            Select Photos
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
