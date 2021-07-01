import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Redirect, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Alert from '@material-ui/lab/Alert';

import { CREATE_PROGRAMME, GET_COLLEGE_PROGRAMMES } from 'graphql/programme';
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

export default function CreateProgramme() {
  const [{ auth, status }, dispatch] = useStore();
  if (!auth.user) {
    return <Redirect to={Routes.AUTH} />;
  }

  const classes = useStyles();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const collegeId = query.get('collegeId');

  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [degree, setDegree] = useState('');
  const [termType, setTermType] = useState('');
  const [termsCount, setTermsCount] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [createProgramme, { loading }] = useMutation(CREATE_PROGRAMME, {
    refetchQueries: [
      {
        query: GET_COLLEGE_PROGRAMMES,
        variables: {
          collegeId: collegeId,
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
    } else if (key === 'degree') {
      setDegree(value);
    } else if (key === 'termType') {
      setTermType(value);
    } else if (key === 'termsCount') {
      setTermsCount(value);
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
      await createProgramme({
        variables: {
          input: {
            name,
            image: photo,
            fullName,
            degree: Number(degree),
            termType: Number(termType),
            termsCount: Number(termsCount),
            description,
            collegeId,
            createdBy: auth.user.id,
          },
        },
      });

      handleReset();
      setMessage('Successfully created programme!');
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
    setDegree('');
    setTermType('');
    setTermsCount('');
    setDescription('');
    setPhoto('');
  };

  const isCreateDisabled = status.uploading || !name || !fullName || !description || !photo || !collegeId;

  return (
    <>
      <Head title="New programme" desc="Add a new programme to an existing college" />

      <SimpleHeader heading="New Programme" loading={status.uploading} />

      <Alert severity="info" className={classes.alert}>
        You need to be Admin to be able to create a new programme. (becoming admin/mod functionality might come in
        future)
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
          placeholder="Programme name (e.g. B.Tech. CS)"
          value={name}
          onChange={handleChange}
          variant="outlined"
          required
        />

        <TextField
          id="fullName"
          label="Full name"
          placeholder="Full name (e.g. Bachelor of technolgy, Computer Science)"
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

        <TextField
          name="degree"
          select
          label="BS./MS./Phd."
          value={degree}
          onChange={handleChange}
          helperText="Please select a degree"
          variant="outlined"
          required
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {['Bachelors', 'Masters', 'Doctorates', 'Diploma', 'Certificate'].map((degreeName, i) => (
            <MenuItem key={degreeName} value={i}>
              {degreeName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          name="termType"
          select
          label="Quarter/Semester/Year"
          value={termType}
          onChange={handleChange}
          helperText="Please select a Term type"
          variant="outlined"
          required
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {['Quarter', 'Semester', 'Year'].map((termName, i) => (
            <MenuItem key={termName} value={i}>
              {termName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          name="termsCount"
          select
          label="Total Quar./Sem./Yr."
          value={termsCount}
          onChange={handleChange}
          helperText="Please select number of Terms"
          variant="outlined"
          required
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.from(new Array(12))
            .map((_el, idx) => String(idx + 1))
            .map((numTerms) => (
              <MenuItem key={numTerms} value={numTerms}>
                {numTerms}
              </MenuItem>
            ))}
        </TextField>

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
