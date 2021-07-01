import { transformer } from '../utils/image-transform';
import { uploadToS3Bucket, deleteFromS3Bucket, uploadPDFToS3Bucket, deletePDFFromS3Bucket } from '../utils/s3-bucket';

const Query = {
  /**
   * Gets all posts
   *
   * @param {string} authUserId
   * @param {int} skip how many posts to skip
   * @param {int} limit how many posts to limit
   */
  getPosts: async (root, { authUserId, skip, limit }, { Post }) => {
    const query = {
      $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }],
    };
    const postsCount = await Post.find(query).countDocuments();
    const allPosts = await Post.find(query)
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

    return { posts: allPosts, count: postsCount };
  },
  /**
   * Gets posts of a specific course, programme and college
   * college > programme > course > posts
   *
   * @param {string} collegeId
   * @param {string} programmeId
   * @param {string} courseId
   * @param {int} skip how many posts to skip
   * @param {int} limit how many posts to limit
   */
  getCollegeProgrammeCoursePosts: async (root, { collegeId, programmeId, courseId, skip, limit }, { Post }) => {
    console.log('>>> getCollegeProgrammeCoursePosts()');

    const query = { $and: [{ college: collegeId }, { programme: programmeId }, { course: courseId }] };

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
      .populate('college')
      .populate('programme')
      .populate('course')
      .skip(skip)
      .limit(limit)
      .sort({ likesCount: 'desc' })
      .sort({ createdAt: -1 });

    return { posts, count };
  },
  /**
   * Gets posts from followed users
   *
   * @param {string} userId
   * @param {int} skip how many posts to skip
   * @param {int} limit how many posts to limit
   */
  getFollowedPosts: async (root, { userId, skip, limit }, { Post, Follow }) => {
    // Find user ids, that current user follows
    const userFollowing = [];
    const follow = await Follow.find({ follower: userId }, { _id: 0 }).select('user');
    follow.map((f) => userFollowing.push(f.user));

    // Find user posts and followed posts by using userFollowing ids array
    const query = {
      $or: [{ author: { $in: userFollowing } }, { author: userId }],
    };
    const followedPostsCount = await Post.find(query).countDocuments();
    const followedPosts = await Post.find(query)
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
      .sort({ createdAt: 'desc' });

    return { posts: followedPosts, count: followedPostsCount };
  },
  /**
   * Gets post by id
   *
   * @param {string} id
   */
  getPost: async (root, { id }, { Post }) => {
    const post = await Post.findById(id)
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
        options: { sort: { createdAt: -1 } },
        populate: { path: 'author' },
      })
      .populate('college')
      .populate('programme')
      .populate('course');

    return post;
  },
};

const Mutation = {
  /**
   * Creates a new post
   *
   * @param {string} title
   * @param {string} image
   * @param {string} authorId
   */
  createPost: async (
    root,
    { input: { title, pdf, images, authorId, collegeId, programmeId, courseId, fileName } },
    { Post, User, Course }
  ) => {
    if (!authorId) {
      throw new Error('authorId param is required.');
    }

    if (pdf && images) {
      throw new Error('only one of pdf and images is allowed in post');
    }

    let imageUrls = [];
    let imagePublicIds = [];
    let pdfUrl, pdfPublicId, thumbnailUrl;

    if (pdf) {
      const { createReadStream } = await pdf;
      const stream = createReadStream();
      let uploadPDF;

      const fileExt = fileName.split('.').pop();

      try {
        uploadPDF = await uploadPDFToS3Bucket(stream, `post/${fileExt}`, fileName);
      } catch (err) {
        throw new Error('Something went wrong while uploading pdf to s3 bucket');
      }

      pdfUrl = uploadPDF.Location;
      pdfPublicId = uploadPDF.Key;
    } else if (images) {
      await Promise.all(images)
        .then((images) => images.map((image) => image.createReadStream()))
        .then((streams) =>
          Promise.all(streams.map((stream) => uploadToS3Bucket(stream, 'post/images', transformer({ width: 600 }))))
        )
        .then((responses) => {
          responses.forEach((response) => {
            imageUrls.push(response.Location);
            imagePublicIds.push(response.Key);
          });
          thumbnailUrl = imageUrls[0];
        })
        .catch((err) => {
          throw err;
        });
    }

    const newPost = await new Post({
      title,
      pdf: pdfUrl,
      pdfPublicId,
      images: imageUrls,
      imagePublicIds,
      thumbnail: thumbnailUrl,
      author: authorId,
      college: collegeId,
      programme: programmeId,
      course: courseId,
    }).save();

    await User.findOneAndUpdate({ _id: authorId }, { $push: { posts: newPost.id } });

    await Course.findOneAndUpdate({ _id: courseId }, { $push: { posts: newPost.id }, $inc: { postsCount: 1 } });

    return newPost;
  },
  /**
   * Deletes a user post
   *
   * @param {string} id
   * @param {imagePublicId} id
   */
  deletePost: async (
    root,
    { input: { id, pdfPublicId, imagePublicIds } },
    { Post, Course, Like, User, Comment, Notification }
  ) => {
    // Remove post pdf from s3 bucket, if pdfPublicId is present
    if (pdfPublicId) {
      deletePDFFromS3Bucket(pdfPublicId).catch((err) => {
        throw err;
      });
    }

    // Remove post image from s3 bucket, if imagePublicIds is present
    if (imagePublicIds) {
      await Promise.all(imagePublicIds.map((pid) => deleteFromS3Bucket(pid))).catch((err) => {
        throw err;
      });
    }

    // Find post and remove it
    const post = await Post.findByIdAndRemove(id).populate('college').populate('programme').populate('course');

    // Delete post from authors (users) posts collection
    await User.findOneAndUpdate({ _id: post.author }, { $pull: { posts: post.id } });

    // Delete post from courses posts collection
    await Course.findOneAndUpdate({ _id: post.course.id }, { $pull: { posts: post.id }, $inc: { postsCount: -1 } });

    // Delete post likes from likes collection
    await Like.find({ post: post.id }).deleteMany();
    // Delete post likes from users collection
    post.likes.map(async (likeId) => {
      await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
    });

    // Delete post comments from comments collection
    await Comment.find({ post: post.id }).deleteMany();
    // Delete comments from users collection
    post.comments.map(async (commentId) => {
      await User.where({ comments: commentId }).update({
        $pull: { comments: commentId },
      });
    });

    // Find user notification in users collection and remove them
    const userNotifications = await Notification.find({ post: post.id });

    userNotifications.map(async (notification) => {
      await User.where({ notifications: notification.id }).update({
        $pull: { notifications: notification.id },
      });
    });
    // Remove notifications from notifications collection
    await Notification.find({ post: post.id }).deleteMany();

    return post;
  },

  /**
   * Increments Views count by 1
   * @param {string} postId
   */
  incrementViewsCount: async (root, { postId }, { Post }) => {
    if (!postId) {
      throw new Error('postId param is required');
    }

    return await Post.findOneAndUpdate({ _id: postId }, { $inc: { viewsCount: 1 } });
  },

  /**
   * Increments Downloads count by 1
   * @param {string} postId
   */
  incrementDownloadsCount: async (root, { postId }, { Post }) => {
    if (!postId) {
      throw new Error('postId param is required');
    }

    return await Post.findOneAndUpdate({ _id: postId }, { $inc: { downloadsCount: 1 } });
  },
};

export default { Query, Mutation };
