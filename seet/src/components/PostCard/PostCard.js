import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, generatePath, useParams, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MessageIcon from '@material-ui/icons/Message';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import Like from 'components/Like';
import Comment from 'components/Comment';
import CreateComment from 'components/CreateComment';
import PostCardOption from './PostCardOption';
import Skeleton from '@material-ui/lab/Skeleton';

import { GET_FOLLOWED_POSTS, DELETE_POST } from 'graphql/post';
import { GET_AUTH_USER } from 'graphql/user';
import { GET_USER_POSTS } from 'graphql/user';
import { GET_COLLEGE_PROGRAMME_COURSE_POSTS } from 'graphql/post';
// import { INCREMENT_DOWNLOADS_COUNT, INCREMENT_VIEWS_COUNT } from 'graphql/post';

import { HOME_PAGE_POSTS_LIMIT, PROFILE_PAGE_POSTS_LIMIT } from 'constants/DataLimit';
import { EXPLORE_PAGE_CARDS_LIMIT } from 'constants/DataLimit';

import { timeAgo } from 'utils/date';

import { useStore } from 'store';

import * as Routes from 'routes';

const DEFAULT_THUMBNAIL = 'https://jhimlish-dev-4.s3.ap-south-1.amazonaws.com/default/pdf-thumbnail.jpg';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: '100%',
    // maxWidth: 345,
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1),
    background: theme.palette.action.hover,
    '& > *': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  media: {
    // paddingTop: '56.25%', // 16:9
    paddingTop: '30%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  comments: {
    display: 'flex',
    flexDirection: 'column',
  },
  optionButton: {
    width: '60px',
  },
  button: {
    marginRight: theme.spacing(3),
  },
  chipContainer: {
    padding: theme.spacing(1),
    '& > *': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  dateChip: {
    background: theme.palette.info.light,
  },
  photosChip: {
    // background: theme.palette.warning.main,
  },
  newChip: {
    background: theme.palette.warning.light,
  },
  populerChip: {
    background: theme.palette.error.light,
  },
  verifiedChip: {
    background: theme.palette.success.light,
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    // right: 14,
    // top: 34,
    fontSize: theme.spacing(1.2),
  },
}))(Badge);

const PostCard = ({
  author,
  pdfPublicId,
  imagePublicIds,
  thumbnail,
  pdf,
  comments,
  title,
  createdAt,
  likes,
  // viewsCount,
  // downloadsCount,
  postId,
  cardDataLoading,
}) => {
  const { collegeId, programmeId, courseId } = useParams();
  const classes = useStyles();
  const { pathname, search, hash } = useLocation();
  const [{ auth }] = useStore();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const [deletePost, { loading }] = useMutation(DELETE_POST, {
    refetchQueries: auth.user && [
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
      {
        query: GET_COLLEGE_PROGRAMME_COURSE_POSTS,
        variables: {
          collegeId: collegeId,
          programmeId: programmeId,
          courseId: courseId,
          skip: 0,
          limit: EXPLORE_PAGE_CARDS_LIMIT,
        },
      },
    ],
  });

  // const [incrementDownloadsCount] = useMutation(INCREMENT_DOWNLOADS_COUNT);
  // const [incrementViewsCount] = useMutation(INCREMENT_VIEWS_COUNT);

  const closeOption = () => setIsOptionOpen(false);

  const openOption = () => setIsOptionOpen(true);

  const handleDelete = async () => {
    if (loading) return;

    try {
      await deletePost({
        variables: { input: { id: postId, pdfPublicId, imagePublicIds } },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDownload = async () => {
  //   try {
  //     await incrementDownloadsCount({ variables: { postId } });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleView = async () => {
  //   try {
  //     await incrementViewsCount({ variables: { postId } });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const toggleCreateComment = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  return (
    <Card className={classes.card}>
      {loading && <LinearProgress color="primary" />}

      {cardDataLoading ? null : (
        <PostCardOption
          postId={postId}
          open={isOptionOpen}
          handleClose={closeOption}
          author={author}
          deletePost={handleDelete}
        />
      )}

      <CardHeader
        avatar={
          cardDataLoading ? (
            <Skeleton animation="wave" variant="circle" width={40} height={40} />
          ) : (
            <Avatar
              aria-label="avatar"
              alt={author.fullName}
              src={author.image || 'show first letter of fullName'}
              component={Link}
              to={generatePath(Routes.USER_PROFILE, { id: author.id })}
            />
          )
        }
        action={
          cardDataLoading ? null : (
            <IconButton
              aria-label="settings"
              aria-haspopup="true"
              onClick={openOption}
              disabled={loading}
              className={classes.optionButton}
            >
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={
          cardDataLoading ? (
            <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
          ) : (
            author.fullName
          )
        }
        subheader={cardDataLoading ? <Skeleton animation="wave" height={10} width="40%" /> : timeAgo(createdAt)}
      />

      <div className={classes.chipContainer}>
        <Chip className={classes.dateChip} label="Jan-2021" />
        <Chip className={classes.photosChip} label="Photos" />
        <Chip className={classes.newChip} label="New" />
        {likes && likes.length > 20 && <Chip className={classes.populerChip} label="Populer" />}
        {likes && likes.length > 10 && <Chip className={classes.verifiedChip} icon={<DoneIcon />} />}
      </div>

      <div className={classes.title}>
        <Typography variant="caption" color="textSecondary">
          {title}
        </Typography>
      </div>

      {cardDataLoading ? (
        <Skeleton animation="wave" variant="rect" className={classes.media} />
      ) : (
        <CardActionArea
          component={Link}
          to={pdf ? `${pathname}${search}${hash}` : generatePath(Routes.POST, { id: postId, type: 'image' })}
        >
          <CardMedia className={classes.media} image={thumbnail || DEFAULT_THUMBNAIL} title={title} />
        </CardActionArea>
      )}

      {cardDataLoading ? (
        <React.Fragment>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
      ) : (
        <CardActions disableSpacing>
          <Like user={author} postId={postId} likes={likes} StyledBadge={StyledBadge} buttonClass={classes.button} />

          <IconButton
            component={Link}
            to={auth.user ? `${pathname}${search}${hash}` : Routes.AUTH}
            aria-label="comment"
            onClick={toggleCreateComment}
            className={classes.button}
          >
            <StyledBadge badgeContent={comments.length} max={9999}>
              <MessageIcon />
            </StyledBadge>
          </IconButton>

          {pdf ? (
            <a href={pdf} download>
              <IconButton aria-label="download" className={classes.button}>
                <GetAppIcon />
              </IconButton>
            </a>
          ) : (
            <IconButton
              component={Link}
              to={generatePath(Routes.POST, { id: postId, type: 'image' })}
              className={classes.button}
            >
              <VisibilityIcon />
            </IconButton>
          )}
          <IconButton
            component={Link}
            to={auth.user ? `${pathname}${search}${hash}` : Routes.AUTH}
            className={clsx(classes.expand, {
              [classes.expandOpen]: isCommentOpen,
            })}
            onClick={toggleCreateComment}
            aria-expanded={isCommentOpen}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      )}

      {cardDataLoading ? null : (
        <Collapse in={isCommentOpen} timeout="auto" unmountOnExit>
          <CardContent>
            <CreateComment post={{ id: postId, author }} focus={isCommentOpen} />
          </CardContent>
          <CardContent>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} postId={postId} postAuthor={author} />
            ))}
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
};

PostCard.propTypes = {
  author: PropTypes.object,
  imagePublicId: PropTypes.string,
  imagePublicIds: PropTypes.array,
  title: PropTypes.string,
  image: PropTypes.string,
  images: PropTypes.array,
  likes: PropTypes.array,
  comments: PropTypes.array,
  createdAt: PropTypes.string,
  postId: PropTypes.string,
  cardDataLoading: PropTypes.bool,
};

export default PostCard;
