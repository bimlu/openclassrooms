import mongoose from 'mongoose';
import { withFilter, AuthenticationError } from 'apollo-server';

import { uploadToS3Bucket } from '../utils/s3-bucket';
import { pubSub } from '../utils/apollo-server';

import { transformer } from '../utils/image-transform';
import { Subscriptions } from '../constants/Subscriptions';
import { UserRole } from '../constants/types';

export const assertAuthenticated = (authUser) => {
  if (!authUser) {
    throw new AuthenticationError('You need to be logged in');
  }
};

export const assertAdmin = (authUser) => {
  assertAuthenticated(authUser);

  if (UserRole.Admin > authUser.role) {
    throw new AuthenticationError('You need to be admin');
  }
};

const Query = {
  /**
   * Gets the currently logged in user
   */
  getAuthUser: async (root, args, { authUser, Message, User }) => {
    if (!authUser) return null;

    // If user is authenticated, update it's isOnline field to true
    const user = await User.findOneAndUpdate({ _id: authUser._id }, { isOnline: true })
      .populate({ path: 'posts', options: { sort: { createdAt: 'desc' } } })
      .populate('likes')
      .populate('followers')
      .populate('following')
      .populate({
        path: 'notifications',
        populate: [
          { path: 'author' },
          { path: 'follow' },
          { path: 'like', populate: { path: 'post' } },
          { path: 'comment', populate: { path: 'post' } },
        ],
        match: { seen: false },
      })
      .populate('college')
      .populate('programme')
      .populate('courses');

    // handle the case when authuser is not in the database
    if (!user) return null;

    user.newNotifications = user.notifications;

    // Find unseen messages
    const lastUnseenMessages = await Message.aggregate([
      {
        $match: {
          receiver: mongoose.Types.ObjectId(authUser.id),
          seen: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$sender',
          doc: {
            $first: '$$ROOT',
          },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
    ]);

    // Transform data
    const newConversations = [];
    lastUnseenMessages.map((u) => {
      const user = {
        id: u.sender[0]._id,
        username: u.sender[0].username,
        fullName: u.sender[0].fullName,
        image: u.sender[0].image,
        lastMessage: u.message,
        lastMessageCreatedAt: u.createdAt,
      };

      newConversations.push(user);
    });

    // Sort users by last created messages date
    const sortedConversations = newConversations.sort((a, b) =>
      b.lastMessageCreatedAt.toString().localeCompare(a.lastMessageCreatedAt)
    );

    // Attach new conversations to auth User
    user.newConversations = sortedConversations;

    return user;
  },
  /**
   * Gets user by username
   *
   * @param {string} username
   */
  getUser: async (root, { userId }, { User, authUser }) => {
    if (!userId) {
      throw new Error('userId is a required param');
    }

    // assertAuthenticated(authUser);

    const user = await User.findById(userId)
      .populate({
        path: 'posts',
        populate: [
          {
            path: 'author',
            populate: [
              { path: 'followers' },
              { path: 'following' },
              {
                path: 'notifications',
                populate: [{ path: 'author' }, { path: 'follow' }, { path: 'like' }, { path: 'comment' }],
              },
            ],
          },
          { path: 'comments', populate: { path: 'author' } },
          { path: 'likes' },
        ],
        options: { sort: { createdAt: 'desc' } },
      })
      .populate('likes')
      .populate('followers')
      .populate('following')
      .populate({
        path: 'notifications',
        populate: [{ path: 'author' }, { path: 'follow' }, { path: 'like' }, { path: 'comment' }],
      })
      .populate('college')
      .populate('programme')
      .populate('courses');

    if (!user) {
      throw new Error("User with given params doesn't exists.");
    }

    return user;
  },
  /**
   * Gets user posts by username
   *
   * @param {string} username
   * @param {int} skip how many posts to skip
   * @param {int} limit how many posts to limit
   */
  getUserPosts: async (root, { userId, skip, limit }, { User, Post }) => {
    const user = await User.findById(userId).select('_id');

    const query = { author: user._id };
    const count = await Post.find(query).countDocuments();
    const posts = await Post.find(query)
      .populate({
        path: 'author',
        populate: [
          { path: 'following' },
          { path: 'followers' },
          {
            path: 'notifications',
            populate: [{ path: 'author' }, { path: 'follow' }, { path: 'like' }, { path: 'comment' }],
          },
        ],
      })
      .populate('likes')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 'desc' } },
        populate: { path: 'author' },
      })
      .skip(skip)
      .limit(limit)
      .sort({ likesCount: -1 })
      .sort({ createdAt: -1 });

    return { posts, count };
  },
  /**
   * Gets all users
   *
   * @param {string} userId
   * @param {int} skip how many users to skip
   * @param {int} limit how many users to limit
   */
  getUsers: async (root, { userId, skip, limit }, { User, Follow }) => {
    // Find user ids, that current user follows
    const userFollowing = [];
    const follow = await Follow.find({ follower: userId }, { _id: 0 }).select('user');
    follow.map((f) => userFollowing.push(f.user));

    // Find users that user is not following
    const query = {
      $and: [{ _id: { $ne: userId } }, { _id: { $nin: userFollowing } }],
    };
    const count = await User.where(query).countDocuments();
    const users = await User.find(query)
      .populate('followers')
      .populate('following')
      .populate({
        path: 'notifications',
        populate: [{ path: 'author' }, { path: 'follow' }, { path: 'like' }, { path: 'comment' }],
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { users, count };
  },
  /**
   * Searches users by username or fullName
   *
   * @param {string} searchQuery
   */
  searchUsers: async (root, { searchQuery }, { User, authUser }) => {
    // Return an empty array if searchQuery isn't presented
    if (!searchQuery) {
      return [];
    }

    const users = User.find({
      $or: [{ username: new RegExp(searchQuery, 'i') }, { fullName: new RegExp(searchQuery, 'i') }],
      _id: {
        $ne: authUser.id,
      },
    }).limit(50);

    return users;
  },
  /**
   * Gets Suggested people for user
   *
   * @param {string} userId
   */
  suggestPeople: async (root, { userId }, { User, Follow }) => {
    const LIMIT = 6;

    // Find who user follows
    const userFollowing = [];
    const following = await Follow.find({ follower: userId }, { _id: 0 }).select('user');
    following.map((f) => userFollowing.push(f.user));
    userFollowing.push(userId);

    // Find random users
    const query = { _id: { $nin: userFollowing } };
    const usersCount = await User.where(query).countDocuments();
    let random = Math.floor(Math.random() * usersCount);

    const usersLeft = usersCount - random;
    if (usersLeft < LIMIT) {
      random = random - (LIMIT - usersLeft);
      if (random < 0) {
        random = 0;
      }
    }

    const randomUsers = await User.find(query).skip(random).limit(LIMIT);

    return randomUsers;
  },
};

const Mutation = {
  /**
   * Uploads user Profile or Cover photo
   *
   * @param {string} id
   * @param {obj} image
   * @param {string} imagePublicId
   * @param {bool} isCover is Cover or Profile photo
   */
  uploadUserPhoto: async (root, { input: { id, image, imagePublicId, isCover } }, { User }) => {
    const { createReadStream } = await image;
    const stream = createReadStream();
    let uploadImage;
    try {
      uploadImage = await uploadToS3Bucket(stream, 'user', transformer({ width: 176 }), imagePublicId);
    } catch (err) {
      throw new Error('Something went wrong while uploading image to s3 bucket');
    }

    const fieldsToUpdate = {};
    if (isCover) {
      fieldsToUpdate.coverImage = uploadImage.Location;
      fieldsToUpdate.coverImagePublicId = uploadImage.Key;
    } else {
      fieldsToUpdate.image = uploadImage.Location;
      fieldsToUpdate.imagePublicId = uploadImage.Key;
    }

    const updatedUser = await User.findOneAndUpdate({ _id: id }, { ...fieldsToUpdate }, { new: true })
      .populate('posts')
      .populate('likes');

    return updatedUser;
  },
  /**
   * Update college of user
   *
   * @param {string} id
   * @param {string} collegeId
   */
  updateUserCollege: async (root, { input: { id, collegeId } }, { User, College }) => {
    console.log('>>> updateUserCollege()');

    if (!id) {
      throw new Error('id param is required');
    }

    const user = await User.findOne({ _id: id }).populate('college');

    if (user.college) {
      // remove the student from previous college in college collection
      await College.findOneAndUpdate(
        { _id: user.college.id },
        { $pull: { students: user.id }, $inc: { studentsCount: -1 } }
      );
    }

    // update users college in User collection
    const updatedUser = await User.findOneAndUpdate({ _id: id }, { college: collegeId });

    // add student to new college in college collection
    await College.findOneAndUpdate({ _id: collegeId }, { $push: { students: id }, $inc: { studentsCount: 1 } });

    return updatedUser;
  },
  /**
   * Updates programme of user
   *
   * @param {string} id
   * @param {string} programmeId
   */
  updateUserProgramme: async (root, { input: { id, programmeId } }, { User, Programme }) => {
    console.log('>>> updateUserProgramme()');

    if (!id) {
      throw new Error('id param is required');
    }

    const user = await User.findOne({ _id: id }).populate('programme');

    if (user.programme) {
      // remove the student from previous programme in programme collection
      await Programme.findOneAndUpdate(
        { _id: user.programme.id },
        { $pull: { students: user.id }, $inc: { studentsCount: -1 } }
      );
    }

    // update users programme in User collection
    const updatedUser = await User.findOneAndUpdate({ _id: id }, { programme: programmeId });

    // add student to new programme in programme collection
    await Programme.findOneAndUpdate({ _id: programmeId }, { $push: { students: id }, $inc: { studentsCount: 1 } });

    return updatedUser;
  },
  /**
   * Adds a course to user
   *
   * @param {string} id
   * @param {string} courseId
   */
  addUserCourse: async (root, { input: { id, courseId } }, { User, Course }) => {
    console.log('>>> addUserCourse()');

    if (!id) {
      throw new Error('id param is required');
    }

    const duplicate = await User.findOne({
      $and: [{ _id: id }, { courses: { $in: courseId } }],
    });

    if (duplicate) {
      throw new Error('User already have this course');
    }

    // add course to User collection
    const updatedUser = await User.findOneAndUpdate({ _id: id }, { $push: { courses: courseId } });

    // add user to Course collection
    await Course.findOneAndUpdate({ _id: courseId }, { $push: { students: id }, $inc: { studentsCount: 1 } });

    return updatedUser;
  },
  /**
   * Removes a course from user
   *
   * @param {string} id
   * @param {string} courseId
   */
  removeUserCourse: async (root, { input: { id, courseId } }, { User, Course }) => {
    console.log('>>> removeUserCourse()');

    if (!id) {
      throw new Error('id param is required');
    }

    let updatedUser;

    if (courseId) {
      // remove course from User collection
      updatedUser = await User.findOneAndUpdate({ _id: id }, { $pull: { courses: courseId } });
      // remoce user from Course collection
      await Course.findOneAndUpdate({ _id: courseId }, { $pull: { students: id }, $inc: { studentsCount: -1 } });
    } else {
      // get alll course of this user
      const user = await User.findOne({ _id: id }).populate('courses');
      // remove user from all old courses
      user.courses.map(async (courseId) => {
        await Course.where({ _id: courseId }).update({
          $pull: { students: id },
          $inc: { studentsCount: -1 },
        });
      });
      // remove all courses if no courseId is provided
      updatedUser = await User.findOneAndUpdate({ _id: id }, { courses: [] });
    }

    return updatedUser;
  },
};

const Subscription = {
  /**
   * Subscribes to user's isOnline change event
   */
  isUserOnline: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(Subscriptions.Is_User_Online),
      (payload, variables, { authUser }) => variables.authUserId === authUserId
    ),
  },
};

export default { Query, Mutation, Subscription };
