import mongoose, { Document } from 'mongoose';

import { UserRole } from '../constants/types';

const Schema = mongoose.Schema;

/**
 * User schema that has references to Post, Like, Comment, Follow schemas
 */
const userSchema = new Schema(
  {
    role: {
      type: UserRole,
      required: true,
      default: UserRole.User,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    facebookId: String,
    googleId: String,
    githubId: String,
    twitterId: String,
    image: String,
    imagePublicId: String,
    about: String,
    website: String,
    coverImage: String,
    coverImagePublicId: String,
    isOnline: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    college: {
      type: Schema.Types.ObjectId,
      ref: 'College',
    },
    programme: {
      type: Schema.Types.ObjectId,
      ref: 'Programme',
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
