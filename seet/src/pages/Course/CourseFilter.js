import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { TermType } from 'constants/TermType';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(1),
      textTransform: 'none',
      fontSize: theme.spacing(1.5),
      padding: theme.spacing(1.2),
      borderRadius: theme.spacing(1.2),
    },
  },
}));

export default function CourseFilter({ termType, termsCount, selectedTerm }) {
  const classes = useStyles();

  const handleClick = (hashValue) => {
    window.location.hash = `term=${hashValue}`;
  };

  return (
    <div className={classes.root}>
      <Button
        variant={selectedTerm === 'all' ? 'contained' : 'outlined'}
        size="small"
        color="primary"
        onClick={() => handleClick('all')}
      >
        All
      </Button>

      {Array.from(new Array(termsCount))
        .map((_el, idx) => idx + 1)
        .map((num) => (
          <Button
            variant={selectedTerm === String(num) ? 'contained' : 'outlined'}
            size="small"
            color="primary"
            key={num}
            onClick={() => handleClick(num)}
          >
            {`${TermType[termType]}-${num}`}
          </Button>
        ))}
    </div>
  );
}
