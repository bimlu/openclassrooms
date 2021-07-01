import React from 'react';
import { Link, generatePath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import EditIcon from '@material-ui/icons/Edit';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { CollegeIcon, ProgrammeIcon, CourseIcon } from 'components/icons';

import HideOnScroll from 'components/SpeedDial/HideSpeedDialOnScroll';

import { useStore } from 'store';
import * as Routes from 'routes';

const useStyles = makeStyles((theme) => ({
  root: {},
  speedDial: {
    position: 'fixed',
    bottom: '10%',
    right: '5%',
  },
  backdrop: {
    zIndex: theme.zIndex.xl,
  },
}));

export default function SpeedDialTooltipOpen() {
  const [{ auth }] = useStore();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const actions = [
    {
      icon: (
        <Link
          to={
            auth.user
              ? generatePath(Routes.POST, { id: Routes.NEW_ID_VALUE, type: 'pdf' })
              : generatePath(Routes.LOG_IN)
          }
        >
          <PictureAsPdfIcon fontSize="small" color="action" />
        </Link>
      ),
      name: 'PDF',
    },
    {
      icon: (
        <Link
          to={
            auth.user
              ? generatePath(Routes.POST, { id: Routes.NEW_ID_VALUE, type: 'image' })
              : generatePath(Routes.LOG_IN)
          }
        >
          <PhotoLibraryIcon fontSize="small" color="action" />
        </Link>
      ),
      name: 'Photos',
    },
    {
      icon: (
        <Link to={auth.user ? generatePath(Routes.COURSE, { id: Routes.NEW_ID_VALUE }) : generatePath(Routes.LOG_IN)}>
          <CourseIcon width="26" />
        </Link>
      ),
      name: 'Course',
    },
    {
      icon: (
        <Link
          to={auth.user ? generatePath(Routes.PROGRAMME, { id: Routes.NEW_ID_VALUE }) : generatePath(Routes.LOG_IN)}
        >
          <ProgrammeIcon width="29" />
        </Link>
      ),
      name: 'Programme',
    },
    {
      icon: (
        <Link to={auth.user ? generatePath(Routes.COLLEGE, { id: Routes.NEW_ID_VALUE }) : generatePath(Routes.LOG_IN)}>
          <CollegeIcon width="29" />
        </Link>
      ),
      name: 'College',
    },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <HideOnScroll>
      <div className={classes.root}>
        <Backdrop open={open} className={classes.backdrop} />
        <SpeedDial
          ariaLabel="SpeedDial for uploading assignments"
          className={classes.speedDial}
          hidden={false}
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={handleClick}
            />
          ))}
        </SpeedDial>
      </div>
    </HideOnScroll>
  );
}
