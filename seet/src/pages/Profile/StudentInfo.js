import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/AddCircle';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';

import { CollegeIcon } from 'components/icons';
import { ProgrammeIcon } from 'components/icons';
import { CourseIcon } from 'components/icons';

import {
  UPDATE_USER_COLLEGE,
  UPDATE_USER_PROGRAMME,
  ADD_USER_COURSE,
  REMOVE_USER_COURSE,
  GET_AUTH_USER,
} from 'graphql/user';

import { useStore } from 'store';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  progress: {
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    width: '96%',
    margin: '0 auto',
  },
  paper: {
    minHeight: 150,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& > *': {
      marginBottom: theme.spacing(0.5),
    },
  },
  courses: {
    '& > *': {
      marginBottom: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
  },
  iconWrapper: {
    display: 'flex',
    width: 16,
    height: 16,
    marginLeft: theme.spacing(0.5),
    borderRadius: '50%',
  },
  list: {
    minWidth: 260,
  },
}));

/**
 * Renders student information in profile page
 */
const StudentInfo = ({ user }) => {
  const classes = useStyles();
  const [{ auth, datatree }] = useStore();

  if (!datatree.colleges) {
    return <Redirect to="/" />;
  }
  const client = useApolloClient();
  const [openCollege, setOpenCollege] = useState(false);
  const [openProgromme, setOpenProgramme] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [courses, setCourses] = useState([]);

  const isAuthUsersProfile = auth.user && auth.user.id === user.id;
  useEffect(() => {
    if (!isAuthUsersProfile) return;
    setColleges(datatree.colleges);
  }, [datatree]);

  useEffect(() => {
    if (!isAuthUsersProfile) return;
    if (!auth.user.college) return;
    const authUsersCollege = colleges.find((college) => college.id === auth.user.college.id);
    if (authUsersCollege) {
      setProgrammes(authUsersCollege.programmes);
    }
  }, [colleges, auth.user && auth.user.college]);

  useEffect(() => {
    if (!isAuthUsersProfile) return;
    if (!auth.user.programme) return;
    const authUsersProgramme = programmes.find((programme) => programme.id === auth.user.programme.id);
    if (authUsersProgramme) {
      setCourses(authUsersProgramme.courses);
    }
  }, [programmes, auth.user && auth.user.programme]);

  const handleListItemClick = (listName, id) => {
    if (!isAuthUsersProfile) return;

    if (listName === 'college') {
      updateUserCourses();
      updateUserProgramme();
      updateUserCollege(id);
      setOpenCollege(false);
    } else if (listName === 'programme') {
      updateUserCourses();
      updateUserProgramme(id);
      setOpenProgramme(false);
    } else if (listName === 'course') {
      addUserCourse(id);
      setOpenCourse(false);
    }
  };

  const handleDeleteCourse = (courseId) => {
    if (!isAuthUsersProfile) return;

    removeUserCourse(courseId);
    setOpenCourse(false);
  };

  const updateUserCollege = async (collegeId) => {
    setLoading(true);

    try {
      await client.mutate({
        mutation: UPDATE_USER_COLLEGE,
        variables: { input: { id: auth.user.id, collegeId } },
        refetchQueries: () => [{ query: GET_AUTH_USER }],
      });
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const updateUserProgramme = async (programmeId) => {
    setLoading(true);

    try {
      await client.mutate({
        mutation: UPDATE_USER_PROGRAMME,
        variables: { input: { id: auth.user.id, programmeId } },
        refetchQueries: () => [{ query: GET_AUTH_USER }],
      });
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const updateUserCourses = async () => {
    setLoading(true);

    try {
      await client.mutate({
        mutation: REMOVE_USER_COURSE,
        variables: { input: { id: auth.user.id, courseId: null } },
        refetchQueries: () => [{ query: GET_AUTH_USER }],
      });
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const addUserCourse = async (courseId) => {
    setLoading(true);

    try {
      await client.mutate({
        mutation: ADD_USER_COURSE,
        variables: { input: { id: auth.user.id, courseId } },
        refetchQueries: () => [{ query: GET_AUTH_USER }],
      });
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const removeUserCourse = async (courseId) => {
    setLoading(true);

    try {
      await client.mutate({
        mutation: REMOVE_USER_COURSE,
        variables: { input: { id: auth.user.id, courseId } },
        refetchQueries: () => [{ query: GET_AUTH_USER }],
      });
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className={classes.root}>
      {loading && <LinearProgress color="primary" className={classes.progress} />}

      <div className={classes.paper}>
        <Chip
          color="primary"
          variant={user.college ? 'outlined' : 'default'}
          label={
            user.college
              ? user.college.name.toUpperCase()
              : isAuthUsersProfile
              ? 'Select college'
              : 'No college selected'
          }
          deleteIcon={user.college ? <EditIcon /> : <AddIcon />}
          onDelete={() => setOpenCollege(true)}
          disabled={!isAuthUsersProfile || loading}
          icon={
            <div className={classes.iconWrapper}>
              <CollegeIcon />
            </div>
          }
        />

        <Chip
          color="primary"
          variant={user.programme ? 'outlined' : 'default'}
          label={
            user.programme
              ? user.programme.name.toUpperCase()
              : isAuthUsersProfile
              ? 'Select programme'
              : 'No programme selected'
          }
          deleteIcon={user.programme ? <EditIcon /> : <AddIcon />}
          onDelete={() => setOpenProgramme(true)}
          disabled={!isAuthUsersProfile || loading}
          icon={
            <div className={classes.iconWrapper}>
              <ProgrammeIcon />
            </div>
          }
        />

        <div className={classes.courses}>
          {user.courses.map((course) => (
            <Chip
              color="primary"
              key={course.id}
              variant="outlined"
              label={course.name.toUpperCase()}
              deleteIcon={<CloseIcon />}
              onDelete={() => handleDeleteCourse(course.id)}
              disabled={!isAuthUsersProfile || loading}
              icon={
                <div className={classes.iconWrapper}>
                  <CourseIcon />
                </div>
              }
            />
          ))}

          {isAuthUsersProfile && (
            <Chip
              color="primary"
              variant="default"
              label="Add course"
              deleteIcon={<AddIcon />}
              onDelete={() => setOpenCourse(true)}
              disabled={loading}
            />
          )}
        </div>

        {isAuthUsersProfile && (
          <Dialog onClose={() => setOpenCollege(false)} aria-labelledby="dialog-title" open={openCollege}>
            <DialogTitle>Colleges</DialogTitle>
            <Divider />
            <List className={classes.list}>
              {colleges.length === 0 && <ListItem>No colleges available</ListItem>}
              {colleges.map((college) => (
                <ListItem
                  button
                  divider
                  onClick={() => handleListItemClick('college', college.id)}
                  key={college.id}
                  disabled={auth.user.college && auth.user.college.id === college.id}
                >
                  <ListItemText primary={college.name} secondary={college.fullName} />
                </ListItem>
              ))}
            </List>
          </Dialog>
        )}

        {isAuthUsersProfile && (
          <Dialog onClose={() => setOpenProgramme(false)} aria-labelledby="dialog-title" open={openProgromme}>
            <DialogTitle>Programmes</DialogTitle>
            <Divider />
            <List className={classes.list}>
              {programmes.length === 0 && <ListItem>No programmes available</ListItem>}
              {programmes.map((programme) => (
                <ListItem
                  button
                  divider
                  onClick={() => handleListItemClick('programme', programme.id)}
                  key={programme.id}
                  disabled={auth.user.programme && auth.user.programme.id === programme.id}
                >
                  <ListItemText primary={programme.name} secondary={programme.fullName} />
                </ListItem>
              ))}
            </List>
          </Dialog>
        )}

        {isAuthUsersProfile && (
          <Dialog onClose={() => setOpenCourse(false)} aria-labelledby="dialog-title" open={openCourse}>
            <DialogTitle>Courses</DialogTitle>
            <Divider />
            <List className={classes.list}>
              {courses.length === 0 && <ListItem>No courses available</ListItem>}
              {courses.map((course) => (
                <ListItem
                  button
                  divider
                  onClick={() => handleListItemClick('course', course.id)}
                  key={course.id}
                  disabled={auth.user.courses.find((userCourse) => userCourse.id === course.id) ? true : false}
                >
                  <ListItemText primary={course.name} secondary={course.fullName} />
                </ListItem>
              ))}
            </List>
          </Dialog>
        )}
      </div>
    </div>
  );
};

StudentInfo.propTypes = {
  user: PropTypes.object.isRequired,
};

export default StudentInfo;
