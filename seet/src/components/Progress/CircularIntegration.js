import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 'max-content',
  },
  button: {
    height: '36px',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function CircularIntegration({ handleClick, text }) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);

  const handleButtonClick = (e) => {
    if (!loading) {
      handleClick(e);
      setLoading(true);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Button
        variant="contained"
        color="primary"
        disabled={loading}
        onClick={handleButtonClick}
        className={classes.button}
      >
        {text}
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
}
