import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Color from 'color';
import { Link } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  actionArea: {
    borderRadius: 16,
    transition: '0.2s',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  card: ({ color }) => ({
    minWidth: 256,
    borderRadius: 16,
    // boxShadow: 'none',
    '&:hover': {
      boxShadow: `0 6px 12px 0 ${Color(color).rotate(-12).darken(0.2).fade(0.5)}`,
    },
  }),
  content: () => {
    return {
      minHeight: 120,
      // backgroundColor: color,
      background: theme.palette.background.paper,
      padding: theme.spacing(1),
      '& > *': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginLeft: theme.spacing(1),
      },
    };
  },
  image: {
    component: 'img',
    height: 150,
  },
}));

const SolidCard = ({ title, subtitle, image, color, url, loading, studentData, otherData }) => {
  const classes = useStyles({ color: color });

  return loading ? (
    <Skeleton variant="rect" className={classes.card} height={272} />
  ) : (
    <CardActionArea component={Link} to={url} className={classes.actionArea}>
      <Card className={classes.card}>
        <CardMedia className={classes.image} image={image} alt={title} />
        <CardContent className={classes.content}>
          <Typography variant="h5">{title.toUpperCase()}</Typography>

          <Typography variant="body2">{subtitle}</Typography>

          <Typography variant="caption">{studentData}</Typography>
          {', '}
          <Typography variant="caption">{otherData}</Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default SolidCard;
