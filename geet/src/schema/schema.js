import { gql } from 'apollo-server-express';

import UserSchema from './user';
import FollowSchema from './Follow';
import PostSchema from './Post';
import LikeSchema from './Like';
import CommentSchema from './Comment';
import MessageSchema from './Message';
import NotificationSchema from './Notification';
import CollegeSchema from './College';
import CourseSchema from './Course';
import ProgrammeSchema from './Programme';

const schema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }

  ${UserSchema}
  ${FollowSchema}
  ${PostSchema}
  ${LikeSchema}
  ${CommentSchema}
  ${MessageSchema}
  ${NotificationSchema}
  ${CollegeSchema}
  ${CourseSchema}
  ${ProgrammeSchema}
`;

export default schema;
