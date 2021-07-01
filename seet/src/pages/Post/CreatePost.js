import React, { useEffect, useState } from 'react';
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
import Paper from '@material-ui/core/Paper';

import { GET_FOLLOWED_POSTS, GET_COLLEGE_PROGRAMME_COURSE_POSTS, CREATE_POST } from 'graphql/post';
import { GET_AUTH_USER, GET_USER_POSTS } from 'graphql/user';

import { EXPLORE_PAGE_CARDS_LIMIT, PROFILE_PAGE_POSTS_LIMIT } from 'constants/DataLimit';
import { HOME_PAGE_POSTS_LIMIT } from 'constants/DataLimit';
import { MAX_POST_IMAGE_SIZE } from 'constants/ImageSize';

import Head from 'components/Head';
import SimpleHeader from 'components/SimpleHeader';

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

export default function CreatePost() {
  const [{ auth, status }, dispatch] = useStore();
  if (!auth.user) {
    return <Redirect to={Routes.AUTH} />;
  }

  const classes = useStyles();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const collegeId = query.get('collegeId');
  const programmeId = query.get('programmeId');
  const courseId = query.get('courseId');
  const courseName = query.get('courseName');
  const type = query.get('type');

  const [title, setTitle] = useState('');
  const [imagesOrPDF, setImagesOrPDF] = useState([]);
  const [fileName, setFileName] = useState('');
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

    if (type === 'image') {
      setImagesOrPDF(files);
    } else {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      setImagesOrPDF(file);
      setFileName(`${courseName}.${'jan-2021'}.${title.substr(0, 10)}.${fileExt}`);
    }
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        variables: {
          input:
            type === 'image'
              ? { title, images: imagesOrPDF, authorId: auth.user.id, collegeId, programmeId, courseId }
              : {
                  title,
                  pdf: imagesOrPDF,
                  authorId: auth.user.id,
                  collegeId,
                  programmeId,
                  courseId,
                  fileName,
                },
        },
      });

      handleReset();
      setMessage('Successfully created assignments!');
      setSeverity('success');
      setOpen(true);
    } catch (error) {
      setMessage(
        "Is PDF File inside WhatsApp?, Try Selecting it like this after clicking 'Select PDF file' button:\n File Manager > WhatsApp > Media > WhatsApp Documents > PDF File.\nOR\nSelect the file from appropriate folder in File Manager"
      );
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleReset = () => {
    setTitle('');
    setImagesOrPDF([]);
  };

  const isCreateDisabled =
    type === 'image'
      ? status.uploading || !title || !(imagesOrPDF.length > 0)
      : status.uploading || !title || !imagesOrPDF;

  return (
    <Paper className={classes.paper}>
      <Head title="New post (imagesOrPDF)" desc="Upload assiginments as imagesOrPDF" />

      <SimpleHeader heading={`New Post (${type === 'image' ? 'Photos' : 'File'})`} loading={status.uploading} />

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

        <div>
          <input
            accept={type === 'image' ? 'image/*' : 'application/pdf;application/msword'}
            className={classes.input}
            id="imagesOrPDF"
            type="file"
            multiple
            onChange={handleUpload}
          />
          <label htmlFor="imagesOrPDF">
            <IconButton color="primary" aria-label="upload imagesOrPDF" component="span">
              <PhotoCamera />
            </IconButton>
            Select {type === 'image' ? 'Photos' : 'pdf / docx file'}
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
