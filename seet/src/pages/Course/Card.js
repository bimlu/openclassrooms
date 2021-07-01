import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import CardActionArea from '@material-ui/core/CardActionArea';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    // minHeight: 138,
    borderRadius: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      minHeight: 198,
    },
  },
  button: {
    padding: `${theme.spacing(1.6)}px ${theme.spacing(2.2)}px`,
    fontSize: theme.spacing(1.6),
    borderRadius: theme.spacing(2),
    textTransform: 'none',
  },
  actionArea: {
    borderRadius: theme.spacing(2),
  },
}));

export default function SimpleCard({ title, subtitle, loading, url }) {
  const classes = useStyles();

  return loading ? (
    <Skeleton variant="rect" className={classes.card} height={275} />
  ) : (
    <CardActionArea component={Link} to={url} className={classes.actionArea}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" color="textSecondary" gutterBottom>
            {title}
          </Typography>

          <Typography variant="body1" color="textSecondary">
            {subtitle}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
}
