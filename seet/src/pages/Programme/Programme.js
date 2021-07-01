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
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import { GET_PROGRAMME, DELETE_PROGRAMME, UPDATE_PROGRAMME, TOGGLE_PROGRAMME_VERIFICATION } from 'graphql/programme';
import { GET_COLLEGE_PROGRAMMES } from 'graphql/programme';

import { MAX_POST_IMAGE_SIZE } from 'constants/ImageSize';
import { TermType } from 'constants/TermType';
import { DegreeType } from 'constants/DegreeType';

import NewProgramme from './NewProgramme';
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

const Programme = () => {
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
  const [degree, setDegree] = useState('');
  const [termType, setTermType] = useState('');
  const [termsCount, setTermsCount] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [severity, setSeverity] = useState('error');

  if (id === Routes.NEW_ID_VALUE) {
    return <NewProgramme />;
  }

  const { loading: initialLoading, data } = useQuery(GET_PROGRAMME, {
    variables: {
      id: id,
    },
  });

  const handleDelete = async (e, imagePublicId, collegeId) => {
    if (!auth.user) return;
    if (loading) return;
    setLoading(true);

    try {
      await client.mutate({
        mutation: DELETE_PROGRAMME,
        variables: { input: { id: id, imagePublicId: imagePublicId } },
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
            query: GET_PROGRAMME,
            variables: {
              id: id,
            },
          },
        ],
      });
      // go back to Programmes page
      history.go(-2);
    } catch (err) {
      setMessage(err.graphQLErrors[0].message);
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
        mutation: TOGGLE_PROGRAMME_VERIFICATION,
        variables: { id: id },
        refetchQueries: [
          {
            query: GET_PROGRAMME,
            variables: { id: id },
          },
        ],
      });
    } catch (err) {
      setMessage(err.graphQLErrors[0] ? err.graphQLErrors[0].message : 'Something went wrong, Please try again!');
      setOpen(true);
    }

    setLoading(false);
  };

  const handleEdit = async () => {
    setEditing(!editing);
    setName(programme.name);
    setFullName(programme.fullName);
    setDegree(programme.degree);
    setTermType(programme.termType);
    setTermsCount(programme.termsCount);
    setDescription(programme.description);
    setPhoto(programme.image);
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
        mutation: UPDATE_PROGRAMME,
        variables: {
          input:
            typeof photo !== 'string'
              ? {
                  id,
                  name,
                  image: photo,
                  fullName,
                  degree: Number(degree),
                  termType: Number(termType),
                  termsCount: Number(termsCount),
                  description,
                  updatedBy: auth.user.id,
                }
              : {
                  id,
                  name,
                  fullName,
                  degree: Number(degree),
                  termType: Number(termType),
                  termsCount: Number(termsCount),
                  description,
                  updatedBy: auth.user.id,
                },
        },
        refetchQueries: [
          {
            query: GET_PROGRAMME,
            variables: { id: id },
          },
        ],
      });

      setMessage('Successfully updated programme!');
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

  const programme = data.getProgramme;

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
          placeholder="Programme name (e.g. B.Tech. CS)"
          value={name}
          onChange={handleChange}
          variant="outlined"
          required
        />
      ) : (
        <Typography variant="h5" gutterBottom>
          {programme.name}
        </Typography>
      )}

      {editing ? (
        <TextField
          id="fullName"
          label="Full name"
          placeholder="Full name (e.g. Bachelor of technolgy, Computer Science)"
          value={fullName}
          onChange={handleChange}
          variant="outlined"
          required
        />
      ) : (
        <Typography gutterBottom>{programme.fullName}</Typography>
      )}

      {editing ? (
        <div>
          <input accept="image/*" className={classes.input} id="photos" type="file" onChange={handleUpload} />
          <label htmlFor="photos">
            <IconButton color="primary" aria-label="upload photo" component="span">
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
            <img alt="programme image" src={programme.image} className={classes.image} />
          </Box>
        </>
      )}

      {editing ? (
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
      ) : (
        <Typography gutterBottom>Degree: {DegreeType[programme.degree]}</Typography>
      )}

      {editing ? (
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
      ) : (
        <Typography gutterBottom>Term Type: {TermType[programme.termType]}</Typography>
      )}

      {editing ? (
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
      ) : (
        <Typography gutterBottom>Total Number of Terms: {programme.termsCount}</Typography>
      )}

      <Box mb={2}>
        <Divider />
      </Box>

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
          {programme.description}
        </Typography>
      )}

      {auth.user && (
        <Button
          onClick={(e) => {
            handleDelete(e, programme.imagePublicId, programme.college.id);
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
          {programme.verified ? 'Unverify' : 'Verify'}
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

export default Programme;
